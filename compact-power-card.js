class CompactPowerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._flowAnimations = {};
    this._deviceLineStates = new Map();
    this._labelFlickerStates = new Map();
    this._layoutReady = false;
  }

  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
    this.requestUpdate();
  }

  // --- Helper Methods ---

  _coerceBoolean(val, defaultVal = false) {
    if (val === undefined || val === null) return defaultVal;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const s = val.trim().toLowerCase();
      if (s === "true" || s === "1" || s === "yes" || s === "on") return true;
      if (s === "false" || s === "0" || s === "no" || s === "off") return false;
    }
    return Boolean(val);
  }

  _parseNumberStrict(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return Number.isNaN(val) ? null : val;
    const s = String(val).trim();
    if (!s) return null;
    const parsed = Number(s);
    return Number.isNaN(parsed) ? null : parsed;
  }

  _isUnavailableState(stateVal) {
    if (stateVal === null || stateVal === undefined) return true;
    const s = String(stateVal).trim().toLowerCase();
    return s === "unavailable" || s === "unknown" || s === "none";
  }

  _toWatts(value, unit = "W", absolute = false) {
    const num = this._parseNumberStrict(value);
    if (num === null) return 0;
    const u = String(unit || "").trim().toLowerCase();
    let watts = num;
    if (u === "kw") watts = num * 1000;
    else if (u === "mw") watts = num * 1000000;
    return absolute ? Math.abs(watts) : watts;
  }

  _parseThreshold(thresholdVal) {
    if (thresholdVal === undefined || thresholdVal === null) return null;
    const parsed = this._parseNumberStrict(thresholdVal);
    return parsed !== null ? Math.abs(parsed) : null;
  }

  _isThresholdSuppressed(watts, threshold) {
    if (threshold === null || threshold === undefined) return false;
    return Math.abs(watts) < threshold;
  }

  _opacityFor(watts, threshold) {
    return this._isThresholdSuppressed(watts, threshold) ? 0.3 : 1;
  }

  _getEntityConfig(key) {
    const ent = this._config?.entities?.[key];
    if (!ent) return { entity: null };
    if (typeof ent === "string") return { entity: ent };
    return ent;
  }

  _getNumeric(entityId, attribute = null) {
    if (!this.hass || !entityId) return 0;
    const st = this.hass.states[entityId];
    if (!st) return 0;
    const raw = attribute ? st.attributes?.[attribute] : st.state;
    const num = this._parseNumberStrict(raw);
    return num !== null ? num : 0;
  }

  _getPowerMeta(entityId, unit = "W", attribute = null) {
    const val = this._getNumeric(entityId, attribute);
    const watts = this._toWatts(val, unit);
    return { value: val, watts, unit };
  }

  _getGridPowerMeta(gridCfg, defaultUnit = "W") {
    if (gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity) {
      const impEnt = gridCfg.import_entity || gridCfg.importEntity;
      const expEnt = gridCfg.export_entity || gridCfg.exportEntity;
      const impUnit = this.hass?.states?.[impEnt]?.attributes?.unit_of_measurement || defaultUnit;
      const expUnit = this.hass?.states?.[expEnt]?.attributes?.unit_of_measurement || defaultUnit;
      const impMeta = this._getPowerMeta(impEnt, impUnit);
      const expMeta = this._getPowerMeta(expEnt, expUnit);
      const netWatts = Math.abs(impMeta.watts) - Math.abs(expMeta.watts);
      return { value: netWatts, watts: netWatts, unit: defaultUnit };
    }
    const ent = gridCfg?.entity;
    const unit = this.hass?.states?.[ent]?.attributes?.unit_of_measurement || defaultUnit;
    return this._getPowerMeta(ent, unit);
  }

  _getBatteryPowerMeta(bCfg) {
    if (bCfg?.charge_entity || bCfg?.discharge_entity || bCfg?.chargeEntity || bCfg?.dischargeEntity) {
      const chgEnt = bCfg.charge_entity || bCfg.chargeEntity;
      const disEnt = bCfg.discharge_entity || bCfg.dischargeEntity;
      const chgUnit = this.hass?.states?.[chgEnt]?.attributes?.unit_of_measurement || "W";
      const disUnit = this.hass?.states?.[disEnt]?.attributes?.unit_of_measurement || "W";
      const chgMeta = this._getPowerMeta(chgEnt, chgUnit);
      const disMeta = this._getPowerMeta(disEnt, disUnit);
      const netWatts = Math.abs(disMeta.watts) - Math.abs(chgMeta.watts);
      return { value: netWatts, watts: netWatts, unit: "W" };
    }
    if (bCfg?.entity) {
      const unit = this.hass?.states?.[bCfg.entity]?.attributes?.unit_of_measurement || "W";
      return this._getPowerMeta(bCfg.entity, unit);
    }
    return { value: 0, watts: 0, unit: "W" };
  }

  _getBatterySocValue(batteryCfg) {
    const socEnt = batteryCfg?.state_of_charge || batteryCfg?.soc_entity || batteryCfg?.socEntity;
    if (socEnt) return this._getNumeric(socEnt);
    if (batteryCfg?.entity) {
      const st = this.hass?.states?.[batteryCfg.entity];
      if (st?.attributes?.battery_level !== undefined) return Number(st.attributes.battery_level);
      if (st?.attributes?.state_of_charge !== undefined) return Number(st.attributes.state_of_charge);
    }
    return null;
  }

  _getBatterySocEntity(batteryCfg) {
    return batteryCfg?.state_of_charge || batteryCfg?.soc_entity || batteryCfg?.socEntity || null;
  }

  _getBatteryIcon(socVal) {
    if (socVal === null || Number.isNaN(socVal)) return "mdi:battery";
    if (socVal >= 95) return "mdi:battery";
    if (socVal >= 85) return "mdi:battery-90";
    if (socVal >= 75) return "mdi:battery-80";
    if (socVal >= 65) return "mdi:battery-70";
    if (socVal >= 55) return "mdi:battery-60";
    if (socVal >= 45) return "mdi:battery-50";
    if (socVal >= 35) return "mdi:battery-40";
    if (socVal >= 25) return "mdi:battery-30";
    if (socVal >= 15) return "mdi:battery-20";
    if (socVal >= 5) return "mdi:battery-10";
    return "mdi:battery-outline";
  }

  _getColor(type, cfg) {
    if (cfg?.color) return cfg.color;
    switch (type) {
      case "pv":
        return "var(--energy-solar-color, #ff9800)";
      case "grid":
        return "var(--energy-grid-color, #488fc2)";
      case "battery":
        return "var(--energy-battery-color, #4caf50)";
      case "home":
        return "var(--primary-text-color, #e1e1e1)";
      default:
        return "var(--primary-text-color)";
    }
  }

  _getDecimalPlaces(cfg) {
    if (cfg?.decimals !== undefined && cfg?.decimals !== null) {
      const num = Number(cfg.decimals);
      if (!Number.isNaN(num)) return Math.max(0, Math.min(6, num));
    }
    return 1;
  }

  _getUnitOverride(cfg) {
    return cfg?.unit_of_measurement || cfg?.unit || null;
  }

  _formatPowerWithOverride(watts, decimals, originalUnit, overrideUnit) {
    const absWatts = Math.abs(watts);
    let displayVal = absWatts;
    let unit = overrideUnit || originalUnit || "W";

    if (!overrideUnit) {
      if (absWatts >= 1000) {
        displayVal = absWatts / 1000;
        unit = "kW";
      } else {
        unit = "W";
      }
    } else {
      const u = overrideUnit.trim().toLowerCase();
      if (u === "kw") displayVal = absWatts / 1000;
      else if (u === "mw") displayVal = absWatts / 1000000;
      else if (u === "w") displayVal = absWatts;
    }

    return `${displayVal.toFixed(decimals)}${unit}`;
  }

  _formatEntity(entityId, decimals = 1, attribute = null, unitOverride = null) {
    if (!this.hass || !entityId) return "";
    const st = this.hass.states[entityId];
    if (!st) return "";
    const raw = attribute ? st.attributes?.[attribute] : st.state;
    if (this._isUnavailableState(raw)) return String(raw);
    const num = this._parseNumberStrict(raw);
    if (num === null) return String(raw);
    const unit = unitOverride || (attribute ? "" : st.attributes?.unit_of_measurement) || "";
    return `${num.toFixed(decimals)}${unit ? " " + unit : ""}`;
  }

  _getEntityIcon(entityId, fallback = "mdi:flash") {
    if (!this.hass || !entityId) return fallback;
    const st = this.hass.states[entityId];
    return st?.attributes?.icon || fallback;
  }

  _getLabelIcon(entityId, attribute = null) {
    return this._getEntityIcon(entityId, attribute ? "mdi:numeric" : "mdi:information-outline");
  }

  _getMdiPath(iconName) {
    if (!iconName || typeof iconName !== "string") return null;
    if (window.mdi && window.mdi[iconName]) return window.mdi[iconName];
    return null;
  }

  _useCurvedLines() {
    return this._coerceBoolean(this._config?.use_curved_lines, true);
  }

  _normalizeLabels(labels, fallback = []) {
    if (!labels) return fallback || [];
    if (Array.isArray(labels)) {
      return labels.map((lbl) => (typeof lbl === "string" ? { entity: lbl } : lbl));
    }
    if (typeof labels === "object") return [labels];
    return fallback || [];
  }

  _isPowerDevice(entityId) {
    if (!this.hass || !entityId) return false;
    const st = this.hass.states[entityId];
    if (!st) return false;
    const devClass = st.attributes?.device_class;
    const unit = st.attributes?.unit_of_measurement;
    if (devClass === "power") return true;
    if (unit && ["w", "kw", "mw"].includes(unit.trim().toLowerCase())) return true;
    return false;
  }

  _getSourcesConfig() {
    const rawSources = this._config?.sources || this._config?.auxiliary_devices || [];
    const subtractFromHome = this._coerceBoolean(this._config?.subtract_from_home, false);
    const sources = Array.isArray(rawSources)
      ? rawSources.map((s) => (typeof s === "string" ? { entity: s } : s))
      : [];
    return { sources, subtractFromHome };
  }

  _getLayoutMetrics(options = {}) {
    const { hasPv = true, hasBattery = true, hasAnyLabels = false } = options;
    const baseWidth = 512;
    const baseHeight = 220;
    const designWidth = baseWidth;
    const designHeight = baseHeight;

    const renderScaleY = 1;
    const xScale = 1;
    const maxItemsByColumns = 4;
    const anchorLeftX = 40;

    const sx = (x) => x * xScale;
    const syTop = (y) => y;
    const syHome = (y) => y;
    const syGridBatt = (y) => y;

    const homeCenterX = sx(256);
    const pvCenterX = sx(256);
    const pvNodeY = syTop(40);

    const homeAnchorY = syHome(130);
    const homeLineEndY = homeAnchorY;

    const gridLineStartX = sx(70);
    const gridLineEndX = sx(180);
    const gridNodeY = syGridBatt(170);

    const gridPvStartY = gridNodeY;
    const humpWidth = 100;
    const humpHeightAdj = 30;
    const humpStartX = homeCenterX - humpWidth / 2;
    const humpEndX = homeCenterX + humpWidth / 2;
    const humpPeakY = gridNodeY - humpHeightAdj;
    const humpCtrlInX = humpStartX + 25;
    const humpCtrlOutX = humpEndX - 25;

    const pvGridEndX = sx(130);
    const pvGridTurnRadius = 15;
    const pvBatteryStartX = sx(382);
    const pvBatteryEndY = gridNodeY;

    const gridHomeStartY = gridNodeY;
    const gridHomeEndX = sx(216);
    const batteryHomeStartY = gridNodeY;
    const batteryHomeEndX = sx(296);

    const pvNode = { x: pvCenterX, y: pvNodeY };
    const gridNode = { x: gridLineStartX, y: gridNodeY };
    const batteryNode = { x: sx(442), y: gridNodeY };
    const homeNode = { x: homeCenterX, y: homeAnchorY };

    return {
      designWidth,
      designHeight,
      baseWidth,
      baseHeight,
      renderScaleY,
      xScale,
      maxItemsByColumns,
      anchorLeftX,
      sx,
      syTop,
      syHome,
      syGridBatt,
      homeCenterX,
      pvCenterX,
      pvNodeY,
      homeAnchorY,
      homeLineEndY,
      gridLineStartX,
      gridLineEndX,
      gridNodeY,
      gridPvStartY,
      humpWidth,
      humpHeightAdj,
      humpStartX,
      humpEndX,
      humpPeakY,
      humpCtrlInX,
      humpCtrlOutX,
      pvGridEndX,
      pvGridTurnRadius,
      pvBatteryStartX,
      pvBatteryEndY,
      gridHomeStartY,
      gridHomeEndX,
      batteryHomeStartY,
      batteryHomeEndX,
      pvNode,
      gridNode,
      batteryNode,
      homeNode,
    };
  }

  // --- Animation Management ---

  _startFlow(name, options) {
    if (!this._flowAnimations) this._flowAnimations = {};
    let animState = this._flowAnimations[name];

    if (!animState) {
      animState = {
        active: true,
        geom: options.geom,
        duration: options.duration || 2000,
        startTime: performance.now(),
        pathEl: null,
        pathLength: 0,
        lockCXPercent: options.lockCXPercent || null,
      };
    } else {
      animState.active = true;
      animState.geom = options.geom;
      animState.duration = options.duration || 2000;
      animState.lockCXPercent = options.lockCXPercent || null;
    }

    const dot = this.shadowRoot?.getElementById(`dot-${name}`);
    if (!dot) return;

    const step = (now) => {
      if (!animState.active) return;
      const elapsed = now - animState.startTime;
      const progress = (elapsed % animState.duration) / animState.duration;
      const t = animState.geom.reverse ? 1 - progress : progress;

      let opacity = 1;
      if (progress < 0.1) opacity = progress / 0.1;
      else if (progress > 0.9) opacity = (1 - progress) / 0.1;

      let cx = 0;
      let cy = 0;

      if (animState.geom.mode === "bezier") {
        const { x0, y0, qx, qy, x1, y1 } = animState.geom;
        const oneMinusT = 1 - t;
        cx = oneMinusT * oneMinusT * x0 + 2 * oneMinusT * t * qx + t * t * x1;
        cy = oneMinusT * oneMinusT * y0 + 2 * oneMinusT * t * qy + t * t * y1;
      } else if (animState.geom.mode === "path") {
        if (!animState.pathEl) {
          animState.pathEl = this.shadowRoot?.getElementById(animState.geom.pathId) || null;
          animState.pathLength = animState.pathEl?.getTotalLength ? animState.pathEl.getTotalLength() : 0;
        }
        if (animState.pathEl && animState.pathLength > 0) {
          const sampleDist = animState.geom.reverse
            ? animState.pathLength * (1 - t)
            : animState.pathLength * t;
          const pt = animState.pathEl.getPointAtLength(sampleDist);
          cx = pt.x;
          cy = pt.y;
        } else {
          const fb = animState.geom.fallback || { x1: 0, y1: 0, x2: 0, y2: 0 };
          cx = fb.x1 + (fb.x2 - fb.x1) * t;
          cy = fb.y1 + (fb.y2 - fb.y1) * t;
        }
      } else {
        const { x1, y1, x2, y2 } = animState.geom;
        cx = x1 + (x2 - x1) * t;
        cy = y1 + (y2 - y1) * t;
      }

      if (animState.lockCXPercent) {
        dot.setAttribute("cx", animState.lockCXPercent);
      } else {
        dot.setAttribute("cx", cx.toFixed(2));
      }
      dot.setAttribute("cy", cy.toFixed(2));
      dot.setAttribute("opacity", opacity.toFixed(2));

      animState.frameId = requestAnimationFrame(step);
    };

    animState.frameId = requestAnimationFrame(step);
    this._flowAnimations[name] = animState;
  }

  _stopFlow(name) {
    if (!this._flowAnimations) return;
    const anim = this._flowAnimations[name];
    if (anim) {
      anim.active = false;
      if (anim.frameId) cancelAnimationFrame(anim.frameId);
      delete this._flowAnimations[name];
    }
    const dot = this.shadowRoot?.getElementById(`dot-${name}`);
    if (dot) dot.setAttribute("opacity", "0");
  }

  // --- Interaction Handlers ---

  _handleAction(cfg) {
    if (!cfg) return;
    const action = cfg.tap_action || "more_info";
    const entity = cfg.entity;
    const navPath = cfg.navigation_path;

    if (action === "navigate" && navPath) {
      window.history.pushState(null, "", navPath);
      const ev = new CustomEvent("location-changed", {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(ev);
    } else if (action === "more_info" && entity) {
      const ev = new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: entity },
      });
      this.dispatchEvent(ev);
    }
  }

  _toggleDeviceSwitch(switchEntity, event) {
    if (event) event.stopPropagation();
    if (!this.hass || !switchEntity) return;
    const isBoolean = switchEntity.startsWith("input_boolean.");
    const domain = isBoolean ? "input_boolean" : "switch";
    this.hass.callService(domain, "toggle", { entity_id: switchEntity });
  }

  // --- Main Render Method ---

  render() {
    if (!this._config || !this.hass) return this.html``;

    const pvCfg = this._getEntityConfig("pv");
    const gridCfg = this._getEntityConfig("grid");
    const homeCfg = this._getEntityConfig("home");
    const batteryRaw = this._getEntityConfig("battery");
    const batteryList = Array.isArray(batteryRaw)
      ? batteryRaw
      : batteryRaw
      ? [batteryRaw]
      : [{ entity: null }];
    const batteryCfg = batteryList[0] || { entity: null };

    const hasPv =
      this._config?.entities &&
      Object.prototype.hasOwnProperty.call(this._config.entities, "pv") &&
      Boolean(pvCfg?.entity);
    const hasBattery =
      this._config?.entities &&
      Object.prototype.hasOwnProperty.call(this._config.entities, "battery") &&
      batteryList.some((b) =>
        Boolean(
          b?.entity ||
            b?.charge_entity ||
            b?.discharge_entity ||
            b?.chargeEntity ||
            b?.dischargeEntity
        )
      );

    const thresholdMode = String(this._config?.threshold_mode || "calculations").toLowerCase();
    const useThresholdForCalc = thresholdMode === "calculations";

    const invertGrid = Boolean(gridCfg?.invert_state_values);
    const invertBattery = Boolean(batteryCfg?.invert_state_values);
    const gridUsesDirectional =
      Boolean(gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity);
    const invertGridEffective = invertGrid && !gridUsesDirectional;

    const pvUnit =
      this.hass?.states?.[pvCfg.entity]?.attributes?.unit_of_measurement || "";
    const gridUnit =
      this.hass?.states?.[gridCfg.entity]?.attributes?.unit_of_measurement || "";
    const batteryUnit =
      this.hass?.states?.[batteryCfg.entity]?.attributes?.unit_of_measurement || "";
    const homeUnit =
      this.hass?.states?.[homeCfg.entity]?.attributes?.unit_of_measurement || "";

    const applyThreshold = (value, threshold) => {
      if (threshold == null) return value;
      return this._isThresholdSuppressed(value, threshold) ? 0 : value;
    };

    const pvThreshold = this._toWatts(this._parseThreshold(pvCfg.threshold), "W", true);
    const gridThreshold = this._toWatts(this._parseThreshold(gridCfg.threshold), "W", true);

    const pvMeta = this._getPowerMeta(pvCfg.entity, pvUnit);
    const gridMeta = this._getGridPowerMeta(gridCfg, gridUnit);
    const homeMeta = this._getPowerMeta(homeCfg.entity, homeUnit);

    const pvRawW = pvMeta.watts;
    const pvCalcW = useThresholdForCalc ? applyThreshold(pvRawW, pvThreshold) : pvRawW;
    const pv = Math.max(pvCalcW, 0);

    const gridWatts = Number.isFinite(gridMeta?.watts) ? gridMeta.watts : 0;
    const gridBaseW = invertGridEffective ? -gridWatts : gridWatts;

    let batteryCount = 0;
    const batteryItems = batteryList.map((b) => {
      const meta = this._getBatteryPowerMeta(b);
      const unit =
        meta?.unit ||
        (b.entity && this.hass?.states?.[b.entity]?.attributes?.unit_of_measurement) ||
        "";
      const value = meta?.value != null ? meta.value : this._getNumeric(b.entity);
      const watts = Number.isFinite(meta?.watts)
        ? meta.watts
        : this._toWatts(value, unit);
      const thr = this._toWatts(this._parseThreshold(b.threshold), "W", true);
      const hasDirectional =
        Boolean(b?.charge_entity || b?.discharge_entity || b?.chargeEntity || b?.dischargeEntity);
      const invert = !hasDirectional && Boolean(b?.invert_state_values || invertBattery);
      const raw = invert ? -watts : watts;
      const effective = useThresholdForCalc ? applyThreshold(raw, thr) : raw;
      if (
        b.entity ||
        b.charge_entity ||
        b.discharge_entity ||
        b.chargeEntity ||
        b.dischargeEntity
      ) {
        batteryCount++;
      }
      return { cfg: b, value, unit, watts, raw, effective, threshold: thr };
    });

    const batteryBaseW = batteryItems.reduce((sum, item) => sum + item.effective, 0);
    const grid = useThresholdForCalc ? applyThreshold(gridBaseW, gridThreshold) : gridBaseW;
    const homeRawW = homeMeta.watts;
    const battery = batteryBaseW;

    const { sources: normalizedSources, subtractFromHome } = this._getSourcesConfig();

    let auxUsage = 0;
    let hasPerDeviceInclude = false;
    for (const src of normalizedSources) {
      const entity = src.entity || null;
      const attribute = src.attribute || null;
      if (!this._isPowerDevice(entity)) continue;
      const hasPerDeviceSubtract = Object.prototype.hasOwnProperty.call(src, "subtract_from_home");
      const includeInHome = hasPerDeviceSubtract
        ? this._coerceBoolean(src.subtract_from_home, subtractFromHome)
        : subtractFromHome;
      if (!includeInHome) continue;
      if (hasPerDeviceSubtract && includeInHome) hasPerDeviceInclude = true;
      const srcUnit =
        this.hass?.states?.[entity]?.attributes?.unit_of_measurement || "";
      const srcMeta = this._getPowerMeta(entity, srcUnit, attribute);
      if (!Number.isFinite(srcMeta.watts)) continue;
      const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
      const valForCalc = useThresholdForCalc ? applyThreshold(srcMeta.watts, thr) : srcMeta.watts;
      if (valForCalc > 0) auxUsage += valForCalc;
    }

    const hasHomeEntity = Boolean(homeCfg?.entity);
    const baseHome = Number.isFinite(homeRawW) ? homeRawW : 0;
    const allowSubtract = subtractFromHome || hasPerDeviceInclude;
    let homeEffectiveDisplay = 0;
    if (hasHomeEntity) {
      const adjustedHome = allowSubtract ? baseHome - auxUsage : baseHome;
      homeEffectiveDisplay = Math.max(adjustedHome, 0);
    } else {
      const inferredBase = pv + battery - grid;
      const inferredDisplay = Math.max(allowSubtract ? inferredBase - auxUsage : inferredBase, 0);
      homeEffectiveDisplay = inferredDisplay;
    }

    const pvColor = this._getColor("pv", pvCfg);
    const gridColor = this._getColor("grid", gridCfg);
    const homeColor = this._getColor("home", homeCfg);
    const batteryColor = this._getColor("battery", batteryCfg);

    const gridOpacity = this._opacityFor(gridBaseW, gridThreshold);
    const pvOpacity = this._opacityFor(pvRawW, pvThreshold);
    const batteryOpacity =
      batteryItems.length > 0
        ? Math.max(
            ...batteryItems.map((item) =>
              this._opacityFor(item.raw, item.threshold)
            )
          )
        : 1;

    const curvedLines = this._useCurvedLines();
    const isPvOnly = hasPv && !hasBattery;
    const pvInBatterySlot = isPvOnly;

    const pvLabels = this._normalizeLabels(pvCfg?.labels, null);
    const gridLabelsRaw = this._normalizeLabels(gridCfg?.labels, null);
    const batteryLabelsSource = Array.isArray(this._config?.entities?.battery)
      ? this._config?.entities?.battery_labels || this._config?.entities?.battery?.labels
      : batteryCfg?.labels;
    const batteryLabels = this._normalizeLabels(batteryLabelsSource, null);

    const maxAuxLabels = 2;
    const gridLabels = gridLabelsRaw.slice(0, maxAuxLabels);
    const hasAnyLabels = pvLabels.length > 0 || gridLabels.length > 0 || batteryLabels.length > 0;

    const layout = this._getLayoutMetrics({
      hasPv,
      hasBattery,
      hasAnyLabels,
    });
    const {
      designWidth,
      designHeight,
      baseWidth,
      baseHeight,
      renderScaleY,
      xScale,
      maxItemsByColumns,
      anchorLeftX,
      sx,
      syTop,
      syHome,
      syGridBatt,
      homeCenterX,
      pvCenterX,
      pvNodeY,
      homeAnchorY,
      homeLineEndY,
      gridLineStartX,
      gridLineEndX,
      gridNodeY,
      gridPvStartY,
      humpWidth,
      humpHeightAdj,
      humpStartX,
      humpEndX,
      humpPeakY,
      humpCtrlInX,
      humpCtrlOutX,
      pvGridEndX,
      pvGridTurnRadius,
      pvBatteryStartX,
      pvBatteryEndY,
      gridHomeStartY,
      gridHomeEndX,
      batteryHomeStartY,
      batteryHomeEndX,
      pvNode,
      gridNode,
      batteryNode,
      homeNode,
    } = layout;

    const gridPvPath = `M ${gridNode.x}${gridPvStartY} H ${pvGridEndX - pvGridTurnRadius} Q${pvGridEndX} ${gridPvStartY}${pvGridEndX} ${gridPvStartY - pvGridTurnRadius} V${pvNode.y}`;
    const pvBatteryPath = `M ${pvBatteryStartX}${pvNode.y} H ${batteryNode.x - pvGridTurnRadius} Q${batteryNode.x} ${pvNode.y}${batteryNode.x} ${pvNode.y + pvGridTurnRadius} V${pvBatteryEndY}`;
    const gridHomePath = `M ${gridNode.x}${gridHomeStartY} V ${homeNode.y - pvGridTurnRadius} Q${gridNode.x} ${homeNode.y}${gridNode.x + pvGridTurnRadius} ${homeNode.y} H${gridHomeEndX}`;
    const batteryHomePath = `M ${batteryNode.x}${batteryHomeStartY} V ${homeNode.y - pvGridTurnRadius} Q${batteryNode.x} ${homeNode.y}${batteryNode.x - pvGridTurnRadius} ${homeNode.y} H${batteryHomeEndX}`;
    const gridBatteryPath = `M ${gridNode.x}${gridNode.y} H ${humpStartX} C${humpCtrlInX} ${gridNode.y},${humpCtrlInX} ${humpPeakY},${homeCenterX} ${humpPeakY} C${humpCtrlOutX} ${humpPeakY},${humpCtrlOutX} ${gridNode.y},${humpEndX} ${gridNode.y} H${batteryNode.x}`;

    const hostClasses = [];
    if (!hasPv) hostClasses.push("no-pv");
    if (!hasBattery) hostClasses.push("no-battery");
    if (pvInBatterySlot) hostClasses.push("pv-as-battery");
    const hostClassString = hostClasses.join(" ");

    const now = Date.now();
    if (!this._labelFlickerStates) this._labelFlickerStates = new Map();
    let nextLabelFlickerEnd = null;

    const renderLabelItem = (lbl, keyPrefix, index, alignRight = false) => {
      if (!lbl?.entity) return this.html``;
      const st = this.hass?.states?.[lbl.entity];
      const attr = lbl.attribute || null;
      const decimals = this._getDecimalPlaces(lbl);
      const rawVal = attr ? st?.attributes?.[attr] : st?.state;
      const isUnavail = this._isUnavailableState(rawVal);
      const unitOverride = this._getUnitOverride(lbl);
      const text = isUnavail ? rawVal : this._formatEntity(lbl.entity, decimals, attr, unitOverride);
      const icon = lbl.icon || this._getLabelIcon(lbl.entity, attr);
      const path = this._getMdiPath(icon);
      const isPower = this._isPowerDevice(lbl.entity);
      const numVal = isUnavail ? null : this._parseNumberStrict(rawVal);
      const isNegative = numVal != null && numVal < 0;
      const watts = isPower ? (numVal != null ? Math.abs(numVal) : null) : null;
      const thr = isPower ? this._toWatts(this._parseThreshold(lbl.threshold), "W", true) : null;
      const isSuppressed = isPower && thr != null && watts != null ? watts < thr : false;
      const customColor = lbl.color || null;
      const key = `${keyPrefix}-${lbl.entity}-${attr || "state"}-${index}`;
      const flickerState = this._labelFlickerStates.get(key) || {};
      const flickerUntil = flickerState.flickerUntil || 0;
      const flicker = flickerUntil > now;
      if (flickerUntil > now) {
        nextLabelFlickerEnd = nextLabelFlickerEnd == null ? flickerUntil : Math.min(nextLabelFlickerEnd, flickerUntil);
      }
      const labelOpacity = isSuppressed ? 0.4 : 1;
      const colorStyle = customColor ? `color: ${customColor};` : "";
      const statePart = isUnavail ? rawVal : (text || "");
      const arrowIcon = isNegative ? "mdi:arrow-down" : "mdi:arrow-up";
      const arrowPath = isNegative ? this._getMdiPath(arrowIcon) : null;

      return this.html`
        <div
          class="aux-marker clickable ${flicker ? "label-flicker" : ""}"
          style="--label-opacity: ${labelOpacity}; opacity: var(--label-opacity, 1); ${colorStyle}"
          @click=${() => this._handleAction(lbl)}
        >
          <div style="display: flex; align-items: center; gap: 4px; ${alignRight ? "flex-direction: row-reverse;" : ""}">
            ${path
              ? this.html`
                  <svg viewBox="0 0 24 24" style="width: calc(14px * var(--cpc-scale, 1)); height: calc(14px * var(--cpc-scale, 1)); fill: currentColor; display: block; flex-shrink: 0;">
                    <path d="${path}"></path>
                  </svg>
                `
              : this.html`<ha-icon .icon=${icon} style="--mdc-icon-size: calc(14px * var(--cpc-scale, 1));"></ha-icon>`}
            <div class="aux-label" style="display: flex; align-items: center; gap: 2px;">
              ${isNegative && arrowPath
                ? this.html`
                    <svg viewBox="0 0 24 24" style="width: calc(12px * var(--cpc-scale, 1)); height: calc(12px * var(--cpc-scale, 1)); fill: currentColor; display: block; flex-shrink: 0;">
                      <path d="${arrowPath}"></path>
                    </svg>
                  `
                : isNegative
                ? this.html`<ha-icon .icon=${arrowIcon} style="--mdc-icon-size: calc(12px * var(--cpc-scale, 1));"></ha-icon>`
                : ""}
              ${statePart}
            </div>
          </div>
        </div>
      `;
    };

    if (nextLabelFlickerEnd != null) {
      const delay = Math.max(0, nextLabelFlickerEnd - now + 20);
      if (this._labelFlickerTimer) clearTimeout(this._labelFlickerTimer);
      this._labelFlickerTimer = setTimeout(() => {
        this._labelFlickerTimer = null;
        this.requestUpdate();
      }, delay);
    }

    const hideCardBg = this._coerceBoolean(this._config?.hide_card_background, false);

    const deviceLines = [];
    const sourceList = normalizedSources;
    const maxAuxDevices = Math.min(
      Math.max(1, sourceList.length),
      maxItemsByColumns
    );
    const visibleAuxDevices = sourceList.slice(0, maxAuxDevices);
    const auxCount = visibleAuxDevices.length;
    let auxGroupWidth = 0;
    if (auxCount > 0) {
      const minLeftX = sx(anchorLeftX);
      const fixedRightX = sx(400); // lock to left side of Home node
      const spanWidth = fixedRightX - minLeftX;
      auxGroupWidth = spanWidth;
      const startX = minLeftX;
      const deviceY = syTop(50);
      const strokeY = deviceY + 12; // align line with center of small dot below device icon
      const downY = syHome(131); // match Home card height
      const homeX = homeCenterX; // draw lines straight to center of home node

      visibleAuxDevices.forEach((src, idx) => {
        const entity = src.entity || null;
        const attr = src.attribute || null;
        if (!this._isPowerDevice(entity)) return;
        const srcUnit =
          this.hass?.states?.[entity]?.attributes?.unit_of_measurement || "";
        const srcMeta = this._getPowerMeta(entity, srcUnit, attr);

        const isUnavail = this._isUnavailableState(
          attr ? this.hass?.states?.[entity]?.attributes?.[attr] : this.hass?.states?.[entity]?.state
        );
        const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
        const hideUnderThr = this._coerceBoolean(src.force_hide_under_threshold, false);
        const isSuppressed = thr != null && srcMeta.watts < thr;
        if (hideUnderThr && isSuppressed) return;

        const rawVal = srcMeta.watts;
        const isActive = !isUnavail && rawVal > 0 && !isSuppressed;

        let srcX = startX;
        if (auxCount > 1) {
          srcX = startX + (idx / (auxCount - 1)) * spanWidth;
        } else {
          srcX = startX + spanWidth / 2;
        }

        const devColor = src.color || "var(--energy-battery-in-color)";
        const key = `${entity || "no-entity"}-${attr || "state"}-${idx}`;
        const opacity = isSuppressed ? 0.4 : 1;
        const dashed = !isActive;

        deviceLines.push({
          key,
          startX: srcX,
          startY: strokeY,
          downY,
          upY: strokeY,
          homeX,
          color: devColor,
          dashed,
          opacity,
        });
      });
    }
    this._deviceLines = deviceLines;

    return this.html`
      <ha-card class="${hostClassString} ${hideCardBg ? "transparent" : ""} ${this._layoutReady ? "layout-ready" : ""}">
        <div id="icon-probe" style="display:none;"></div>
        <div class="canvas" style="aspect-ratio: ${designWidth} / ${baseHeight};">
          <svg
            viewBox="0 0 ${designWidth} ${baseHeight}"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="home-gradient" x1="12" y1="3" x2="12" y2="20">
                <stop id="home-stop-1" offset="0%" stop-color="${homeColor}" />
                <stop id="home-stop-2" offset="100%" stop-color="${homeColor}" />
                <stop id="home-stop-3" offset="100%" stop-color="${homeColor}" />
                <stop id="home-stop-4" offset="100%" stop-color="${homeColor}" />
                <stop id="home-stop-5" offset="100%" stop-color="${homeColor}" />
                <stop id="home-stop-6" offset="100%" stop-color="${homeColor}" />
              </linearGradient>
            </defs>
            <g id="flow-lines">
              <path
                id="line-pv-grid"
                class="flow-line pv-section"
                d="${gridPvPath}"
                fill="none"
              ></path>
              <line
                id="line-pv-home"
                class="flow-line pv-section"
                x1="${pvNode.x}"
                y1="${pvNode.y}"
                x2="${homeNode.x}"
                y2="${homeNode.y}"
              ></line>
              <path
                id="line-pv-battery"
                class="flow-line pv-section battery-section"
                d="${pvBatteryPath}"
                fill="none"
              ></path>

              <path
                id="line-grid-home"
                class="flow-line"
                d="${gridHomePath}"
                fill="none"
              ></path>
              <path
                id="line-home-battery"
                class="flow-line battery-section"
                d="${batteryHomePath}"
                fill="none"
              ></path>

              ${curvedLines
                ? this.html`
                    <path
                      id="arc-grid-battery"
                      class="flow-line battery-section"
                      d="${gridBatteryPath}"
                      fill="none"
                    ></path>
                  `
                : this.html`
                    <line
                      id="arc-grid-battery"
                      class="flow-line battery-section"
                      x1="${gridNode.x}"
                      y1="${gridNode.y}"
                      x2="${batteryNode.x}"
                      y2="${batteryNode.y}"
                    ></line>
                  `}
            </g>

            <g id="device-lines"></g>

            <g id="flow-dots">
              <circle id="dot-pv-home" class="flow-dot" r="3.5" fill="${pvColor}" opacity="0"></circle>
              <circle id="dot-pv-battery" class="flow-dot" r="3.5" fill="${pvColor}" opacity="0"></circle>
              <circle id="dot-pv-grid" class="flow-dot" r="3.5" fill="${pvColor}" opacity="0"></circle>

              <circle id="dot-grid-home" class="flow-dot" r="3.5" fill="${gridColor}" opacity="0"></circle>
              <circle id="dot-grid-battery" class="flow-dot" r="3.5" fill="${gridColor}" opacity="0"></circle>

              <circle id="dot-battery-home" class="flow-dot" r="3.5" fill="${batteryColor}" opacity="0"></circle>
              <circle id="dot-battery-grid" class="flow-dot" r="3.5" fill="${batteryColor}" opacity="0"></circle>
            </g>
          </svg>

          <div class="overlay">
            <!-- PV Node -->
            <div
              class="overlay-item pv-section"
              style="left: ${(pvNode.x / baseWidth) * 100}%; top: ${pvNodeY}px;"
            >
              <div
                class="node-marker pv-marker clickable"
                style="opacity: ${pvOpacity}; color: ${pvColor};"
                @click=${() => this._handleAction(pvCfg)}
              >
                <div class="pv-icon-wrap ${this._getMdiPath(pvCfg.icon || this._getEntityIcon(pvCfg.entity, "mdi:solar-power-variant")) ? "custom" : ""}">
                  <div class="pv-icon-circle" style="--cpc-pv-icon-stroke: ${pvColor};"></div>
                  ${(() => {
                    const icon = pvCfg.icon || this._getEntityIcon(pvCfg.entity, "mdi:solar-power-variant");
                    const path = this._getMdiPath(icon);
                    if (path) {
                      return this.html`
                        <svg class="pv-icon" viewBox="0 0 24 24" style="fill: ${pvColor};">
                          <path d="${path}"></path>
                        </svg>
                      `;
                    }
                    return this.html`
                      <ha-icon class="pv-icon" .icon=${icon} style="color: ${pvColor};"></ha-icon>
                    `;
                  })()}
                </div>
                <div class="node-label">
                  ${(() => {
                    const isUnavail = this._isUnavailableState(
                      this.hass?.states?.[pvCfg.entity]?.state
                    );
                    if (isUnavail) return this.hass?.states?.[pvCfg.entity]?.state;
                    const decimals = this._getDecimalPlaces(pvCfg);
                    const formatted = this._formatPowerWithOverride(pvRawW, decimals, pvUnit, this._getUnitOverride(pvCfg));
                    const parts = formatted.split(" ");
                    const num = parts[0];
                    const unit = parts.slice(1).join(" ");
                    return this.html`
                      <span class="value-number">${num}</span>${unit ? this.html`<span class="value-unit">${unit}</span>` : ""}
                    `;
                  })()}
                </div>
              </div>
            </div>

            <!-- PV Labels Node -->
            ${pvLabels.length > 0
              ? this.html`
                  <div
                    class="overlay-item pv-label-marker anchor-left"
                    style="left: ${(pvNode.x / baseWidth) * 100}\%; top:${pvNodeY}px; margin-left: calc(22px * var(--cpc-scale, 1));"
                  >
                    ${pvLabels.map((lbl, idx) => renderLabelItem(lbl, "pv-label", idx))}
                  </div>
                `
              : ""}

            <!-- Grid Node -->
            <div
              class="overlay-item"
              style="left: ${(gridNode.x / baseWidth) * 100}%; top: ${gridNodeY}px;"
            >
              <div
                class="node-marker grid-marker left clickable"
                style="opacity: ${gridOpacity}; color: ${gridColor};"
                @click=${() => this._handleAction(gridCfg)}
              >
                <div class="grid-icon-wrap ${this._getMdiPath(gridCfg.icon || this._getEntityIcon(gridCfg.entity, "mdi:transmission-tower")) ? "custom" : ""}">
                  <div class="grid-icon-circle" style="--cpc-grid-icon-stroke: ${gridColor};"></div>
                  ${(() => {
                    const icon = gridCfg.icon || this._getEntityIcon(gridCfg.entity, "mdi:transmission-tower");
                    const path = this._getMdiPath(icon);
                    if (path) {
                      return this.html`
                        <svg class="grid-icon" viewBox="0 0 24 24" style="fill: ${gridColor};">
                          <path d="${path}"></path>
                        </svg>
                      `;
                    }
                    return this.html`
                      <ha-icon class="grid-icon" .icon=${icon} style="color: ${gridColor};"></ha-icon>
                    `;
                  })()}
                </div>
                <div class="node-label left">
                  ${(() => {
                    const isUnavail = this._isUnavailableState(gridMeta.value);
                    if (isUnavail) return gridMeta.value;
                    const decimals = this._getDecimalPlaces(gridCfg);
                    const formatted = this._formatPowerWithOverride(
                      Math.abs(gridBaseW),
                      decimals,
                      gridUnit,
                      this._getUnitOverride(gridCfg)
                    );
                    const parts = formatted.split(" ");
                    const num = parts[0];
                    const unit = parts.slice(1).join(" ");
                    return this.html`
                      <span class="value-number">${num}</span>${unit ? this.html`<span class="value-unit">${unit}</span>` : ""}
                    `;
                  })()}
                </div>
              </div>
            </div>

            <!-- Grid Labels Node -->
            ${gridLabels.length > 0
              ? this.html`
                  <div
                    class="overlay-item anchor-left"
                    style="left: ${(gridNode.x / baseWidth) * 100}\%; top:${gridNodeY}px; margin-left: calc(22px * var(--cpc-scale, 1));"
                  >
                    ${gridLabels.map((lbl, idx) => renderLabelItem(lbl, "grid-label", idx))}
                  </div>
                `
              : ""}

            <!-- Battery Node -->
            <div
              class="overlay-item battery-section"
              style="left: ${(batteryNode.x / baseWidth) * 100}%; top: ${gridNodeY}px;"
            >
              <div
                class="node-marker battery-marker right clickable"
                style="opacity: ${batteryOpacity}; color: ${batteryColor};"
                @click=${() => this._handleAction(batteryCfg)}
              >
                ${(() => {
                  const socVal = this._getBatterySocValue(batteryCfg);
                  const fallbackIcon = this._getBatteryIcon(socVal);
                  const icon = batteryCfg.icon || this._getEntityIcon(batteryCfg.entity, fallbackIcon);
                  const path = this._getMdiPath(icon);
                  return this.html`
                    <div class="battery-icon-wrap ${path ? "custom" : ""}">
                      <div class="battery-icon-circle" style="--cpc-battery-icon-stroke: ${batteryColor};"></div>
                      ${path
                        ? this.html`
                            <svg class="battery-icon" viewBox="0 0 24 24" style="fill: ${batteryColor};">
                              <path d="${path}"></path>
                            </svg>
                          `
                        : this.html`
                            <ha-icon class="battery-icon" .icon=${icon} style="color: ${batteryColor};"></ha-icon>
                          `}
                    </div>
                  `;
                })()}
                ${batteryItems.length > 1
                  ? this.html`
                      <div class="node-label right battery-multi">
                        ${batteryItems.map((item) => {
                          const isUnavail = this._isUnavailableState(item.value);
                          const decimals = this._getDecimalPlaces(item.cfg);
                          const formatted = isUnavail
                            ? item.value
                            : this._formatPowerWithOverride(
                                Math.abs(item.raw),
                                decimals,
                                item.unit,
                                this._getUnitOverride(item.cfg)
                              );
                          return this.html`
                            <div class="battery-multi-item" @click=${(e) => { e.stopPropagation(); this._handleAction(item.cfg); }}>
                              <span class="value-number">${formatted}</span>
                            </div>
                          `;
                        })}
                      </div>
                    `
                  : this.html`
                      <div class="node-label right">
                        ${(() => {
                          const item = batteryItems[0] || {};
                          const isUnavail = this._isUnavailableState(item.value);
                          if (isUnavail) return item.value;
                          const decimals = this._getDecimalPlaces(batteryCfg);
                          const formatted = this._formatPowerWithOverride(
                            Math.abs(batteryBaseW),
                            decimals,
                            batteryUnit,
                            this._getUnitOverride(batteryCfg)
                          );
                          const parts = formatted.split(" ");
                          const num = parts[0];
                          const unit = parts.slice(1).join(" ");
                          return this.html`
                            <span class="value-number">${num}</span>
                            ${unit ? this.html`<span class="value-unit">${unit}</span>` : ""}
                          `;
                        })()}
                      </div>
                    `}
              </div>
            </div>

            <!-- Battery Labels Node -->
            ${batteryLabels.length > 0
              ? this.html`
                  <div
                    class="overlay-item battery-section anchor-right"
                    style="left: ${(batteryNode.x / baseWidth) * 100}\%; top:${gridNodeY}px; margin-left: calc(-22px * var(--cpc-scale, 1));"
                  >
                    ${batteryLabels.map((lbl, idx) => renderLabelItem(lbl, "battery-label", idx, true))}
                  </div>
                `
              : ""}

            <!-- Devices/Sources Node -->
            ${visibleAuxDevices.map((src, idx) => {
              const entity = src.entity || null;
              const attr = src.attribute || null;
              if (!this._isPowerDevice(entity)) return this.html``;
              const srcUnit =
                this.hass?.states?.[entity]?.attributes?.unit_of_measurement || "";
              const srcMeta = this._getPowerMeta(entity, srcUnit, attr);

              const isUnavail = this._isUnavailableState(
                attr ? this.hass?.states?.[entity]?.attributes?.[attr] : this.hass?.states?.[entity]?.state
              );
              const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
              const hideUnderThr = this._coerceBoolean(src.force_hide_under_threshold, false);
              const isSuppressed = thr != null && srcMeta.watts < thr;
              if (hideUnderThr && isSuppressed) return this.html``;

              const rawVal = srcMeta.watts;
              const isActive = !isUnavail && rawVal > 0 && !isSuppressed;

              const minLeftX = sx(anchorLeftX);
              const fixedRightX = sx(400); // lock to left side of Home node
              const spanWidth = fixedRightX - minLeftX;
              let srcX = minLeftX;
              if (auxCount > 1) {
                srcX = minLeftX + (idx / (auxCount - 1)) * spanWidth;
              } else {
                srcX = minLeftX + spanWidth / 2;
              }
              const deviceY = syTop(50);

              const devColor = src.color || "var(--energy-battery-in-color)";
              const icon = src.icon || this._getEntityIcon(entity, "mdi:power-plug");
              const path = this._getMdiPath(icon);
              const decimals = this._getDecimalPlaces(src);
              const nameText =
                src.name ||
                (entity ? this.hass?.states?.[entity]?.attributes?.friendly_name : null) ||
                "Device";

              const switchEntity = src.switch_entity || null;
              const switchState = switchEntity
                ? String(this.hass?.states?.[switchEntity]?.state || "").toLowerCase()
                : null;
              const isSwitchOn = switchState === "on";

              const key = `${entity || "no-entity"}-${attr \vert{}\vert{} "state"}-${idx}`;
              const lineState = this._deviceLineStates.get(key) || {};
              const flickerUntil = lineState.flickerUntil || 0;
              const flicker = flickerUntil > now;
              const labelOpacity = isSuppressed ? 0.4 : 1;

              return this.html`
                <div
                  class="overlay-item"
                  style="left: ${(srcX / baseWidth) * 100}\%; top:${deviceY}px;"
                >
                  <div
                    class="aux-marker clickable ${flicker ? "device-label-flicker" : ""}"
                    style="--device-label-opacity: ${labelOpacity}; opacity: var(--device-label-opacity, 1); color:${devColor};"
                    @click=${() => this._handleAction(src)}
                  >
                    <div
                      class="device-icon-ring ${switchEntity ? "switchable" : ""} ${isSwitchOn ? "on" : ""}"
                      style="color: ${devColor};"
                      @click=${(e) => {
                        if (switchEntity) this._toggleDeviceSwitch(switchEntity, e);
                      }}
                    >
                      ${path
                        ? this.html`
                            <svg viewBox="0 0 24 24" style="width: calc(20px * var(--cpc-scale, 1)); height: calc(20px * var(--cpc-scale, 1)); fill: ${devColor}; display: block;">
                              <path d="${path}"></path>
                            </svg>
                          `
                        : this.html`
                            <ha-icon .icon=${icon} style="color: ${devColor}; --mdc-icon-size: calc(20px * var(--cpc-scale, 1));"></ha-icon>
                          `}
                    </div>
                    <div class="device-power-dot-wrapper" style="margin-top: calc(-2px * var(--cpc-scale, 1)); color: ${devColor};">
                      <div class="device-power-dot ${isActive ? "active" : ""}"></div>
                    </div>
                    <div class="device-name" style="color: var(--primary-text-color);">
                      ${nameText}
                    </div>
                    <div class="aux-sub-label">
                      ${isUnavail
                        ? srcMeta.value
                        : this._formatPowerWithOverride(
                            rawVal,
                            decimals,
                            srcUnit,
                            this._getUnitOverride(src)
                          )}
                    </div>
                  </div>
                </div>
              `;
            })}

            <!-- Home Node -->
            <div
              class="overlay-item"
              style="left: ${(homeNode.x / baseWidth) * 100}%; top: ${homeAnchorY}px;"
            >
              <div
                class="home-marker clickable"
                style="color: ${homeColor};"
                @click=${() => this._handleAction(homeCfg)}
              >
                <div class="home-icon-wrap ${this._getMdiPath(homeCfg.icon || this._getEntityIcon(homeCfg.entity, "mdi:home")) ? "custom" : ""}">
                  <div class="home-icon-circle"></div>
                  ${(() => {
                    const icon = homeCfg.icon || this._getEntityIcon(homeCfg.entity, "mdi:home");
                    const path = this._getMdiPath(icon);
                    if (path) {
                      return this.html`
                        <svg class="home-icon" viewBox="0 0 24 24" style="fill: var(--cpc-home-winner, ${homeColor});">
                          <path d="${path}"></path>
                        </svg>
                      `;
                    }
                    return this.html`
                      <ha-icon class="home-icon" .icon=${icon} style="color: var(--cpc-home-winner, ${homeColor});"></ha-icon>
                    `;
                  })()}
                </div>
                <div class="home-label" style="color: ${homeColor};">
                  ${(() => {
                    const isUnavail =
                      hasHomeEntity &&
                      this._isUnavailableState(this.hass?.states?.[homeCfg.entity]?.state);
                    if (isUnavail) return this.hass?.states?.[homeCfg.entity]?.state;
                    const decimals = this._getDecimalPlaces(homeCfg);
                    const formatted = this._formatPowerWithOverride(
                      homeEffectiveDisplay,
                      decimals,
                      homeUnit,
                      this._getUnitOverride(homeCfg)
                    );
                    const parts = formatted.split(" ");
                    const num = parts[0];
                    const unit = parts.slice(1).join(" ");
                    return this.html`
                      <span class="value-number">${num}</span>${unit ? this.html`<span class="value-unit">${unit}</span>` : ""}
                    `;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  // --- LitElement Helper for Template Engine Fallback ---
  html(strings, ...values) {
    if (window.LitElement || window.lit) {
      const litHtml = window.litHtml || window.lit?.html;
      if (litHtml) return litHtml(strings, ...values);
    }
    return strings.reduce((result, string, i) => result + string + (values[i] || ""), "");
  }
}

customElements.define("compact-power-card", CompactPowerCard);
