// Register with Home Assistant custom cards registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: "compact-power-card",
  name: "Compact Power Card",
  description: "A compact power flow card for Home Assistant",
});

// Import LitElement from Home Assistant's loaded Lit instance
const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || HTMLElement
);
const html = LitElement.prototype?.html || window.litHtml || ((strings, ...values) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), ""));

class CompactPowerCard extends LitElement {
  constructor() {
    super();
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
    const baseWidth = 512;
    const baseHeight = 220;
    const designWidth = baseWidth;
    const anchorLeftX = 40;

    const sx = (x) => x;
    const syTop = (y) => y;
    const syHome = (y) => y;
    const syGridBatt = (y) => y;

    const homeCenterX = sx(256);
    const pvNodeY = syTop(40);
    const homeAnchorY = syHome(130);

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

    const pvNode = { x: homeCenterX, y: pvNodeY };
    const gridNode = { x: sx(70), y: gridNodeY };
    const batteryNode = { x: sx(442), y: gridNodeY };
    const homeNode = { x: homeCenterX, y: homeAnchorY };

    return {
      designWidth,
      baseWidth,
      baseHeight,
      anchorLeftX,
      sx,
      syTop,
      syHome,
      syGridBatt,
      homeCenterX,
      pvNodeY,
      homeAnchorY,
      gridNodeY,
      gridPvStartY,
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

  _handleAction(cfg) {
    if (!cfg) return;
    const action = cfg.tap_action || "more_info";
    const entity = cfg.entity;
    const navPath = cfg.navigation_path;

    if (action === "navigate" && navPath) {
      window.history.pushState(null, "", navPath);
      this.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    } else if (action === "more_info" && entity) {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: entity },
        })
      );
    }
  }

  _toggleDeviceSwitch(switchEntity, event) {
    if (event) event.stopPropagation();
    if (!this.hass || !switchEntity) return;
    const isBoolean = switchEntity.startsWith("input_boolean.");
    const domain = isBoolean ? "input_boolean" : "switch";
    this.hass.callService(domain, "toggle", { entity_id: switchEntity });
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const pvCfg = this._getEntityConfig("pv");
    const gridCfg = this._getEntityConfig("grid");
    const homeCfg = this._getEntityConfig("home");
    const batteryRaw = this._getEntityConfig("battery");
    const batteryList = Array.isArray(batteryRaw) ? batteryRaw : batteryRaw ? [batteryRaw] : [{ entity: null }];
    const batteryCfg = batteryList[0] || { entity: null };

    const hasPv = Boolean(pvCfg?.entity);
    const hasBattery = batteryList.some((b) => Boolean(b?.entity || b?.charge_entity || b?.discharge_entity));

    const thresholdMode = String(this._config?.threshold_mode || "calculations").toLowerCase();
    const useThresholdForCalc = thresholdMode === "calculations";

    const invertGrid = Boolean(gridCfg?.invert_state_values);
    const invertBattery = Boolean(batteryCfg?.invert_state_values);
    const gridUsesDirectional = Boolean(gridCfg?.import_entity || gridCfg?.export_entity);
    const invertGridEffective = invertGrid && !gridUsesDirectional;

    const pvUnit = this.hass?.states?.[pvCfg.entity]?.attributes?.unit_of_measurement || "";
    const gridUnit = this.hass?.states?.[gridCfg.entity]?.attributes?.unit_of_measurement || "";
    const batteryUnit = this.hass?.states?.[batteryCfg.entity]?.attributes?.unit_of_measurement || "";
    const homeUnit = this.hass?.states?.[homeCfg.entity]?.attributes?.unit_of_measurement || "";

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

    const batteryItems = batteryList.map((b) => {
      const meta = this._getBatteryPowerMeta(b);
      const unit = meta?.unit || (b.entity && this.hass?.states?.[b.entity]?.attributes?.unit_of_measurement) || "";
      const value = meta?.value != null ? meta.value : this._getNumeric(b.entity);
      const watts = Number.isFinite(meta?.watts) ? meta.watts : this._toWatts(value, unit);
      const thr = this._toWatts(this._parseThreshold(b.threshold), "W", true);
      const hasDirectional = Boolean(b?.charge_entity || b?.discharge_entity);
      const invert = !hasDirectional && Boolean(b?.invert_state_values || invertBattery);
      const raw = invert ? -watts : watts;
      const effective = useThresholdForCalc ? applyThreshold(raw, thr) : raw;
      return { cfg: b, value, unit, watts, raw, effective, threshold: thr };
    });

    const batteryBaseW = batteryItems.reduce((sum, item) => sum + item.effective, 0);
    const grid = useThresholdForCalc ? applyThreshold(gridBaseW, gridThreshold) : gridBaseW;
    const homeRawW = homeMeta.watts;
    const battery = batteryBaseW;

    const { sources: normalizedSources, subtractFromHome } = this._getSourcesConfig();

    let auxUsage = 0;
    for (const src of normalizedSources) {
      const entity = src.entity || null;
      if (!this._isPowerDevice(entity)) continue;
      const srcUnit = this.hass?.states?.[entity]?.attributes?.unit_of_measurement || "";
      const srcMeta = this._getPowerMeta(entity, srcUnit, src.attribute);
      if (!Number.isFinite(srcMeta.watts)) continue;
      const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
      const valForCalc = useThresholdForCalc ? applyThreshold(srcMeta.watts, thr) : srcMeta.watts;
      if (valForCalc > 0) auxUsage += valForCalc;
    }

    const hasHomeEntity = Boolean(homeCfg?.entity);
    const baseHome = Number.isFinite(homeRawW) ? homeRawW : 0;
    let homeEffectiveDisplay = hasHomeEntity
      ? Math.max(subtractFromHome ? baseHome - auxUsage : baseHome, 0)
      : Math.max(pv + battery - grid - (subtractFromHome ? auxUsage : 0), 0);

    const pvColor = this._getColor("pv", pvCfg);
    const gridColor = this._getColor("grid", gridCfg);
    const homeColor = this._getColor("home", homeCfg);
    const batteryColor = this._getColor("battery", batteryCfg);

    const layout = this._getLayoutMetrics();
    const { designWidth, baseWidth, baseHeight, pvNode, gridNode, batteryNode, homeNode } = layout;

    return html`
      <ha-card>
        <div class="card-content" style="padding: 16px; text-align: center;">
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <div @click=${() => this._handleAction(pvCfg)} style="cursor: pointer;">
              <ha-icon icon="${pvCfg.icon || 'mdi:solar-power'}" style="color: ${pvColor};"></ha-icon>
              <div>${this._formatPowerWithOverride(pvRawW, 1, pvUnit, null)}</div>
            </div>
            <div @click=${() => this._handleAction(gridCfg)} style="cursor: pointer;">
              <ha-icon icon="${gridCfg.icon || 'mdi:transmission-tower'}" style="color: ${gridColor};"></ha-icon>
              <div>${this._formatPowerWithOverride(Math.abs(gridBaseW), 1, gridUnit, null)}</div>
            </div>
            <div @click=${() => this._handleAction(homeCfg)} style="cursor: pointer;">
              <ha-icon icon="${homeCfg.icon || 'mdi:home'}" style="color: ${homeColor};"></ha-icon>
              <div>${this._formatPowerWithOverride(homeEffectiveDisplay, 1, homeUnit, null)}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

// Ensure unique custom element registration
if (!customElements.get("compact-power-card")) {
  customElements.define("compact-power-card", CompactPowerCard);
}
