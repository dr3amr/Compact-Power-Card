const compactPowerCardPanel =
  customElements.get("ha-panel-lovelace") || customElements.get("hui-masonry-view");

const CompactPowerCardBase =
  (compactPowerCardPanel && Object.getPrototypeOf(compactPowerCardPanel)) ||
  window.LitElement;

const compactPowerCardHtml =
  (typeof window.html === "function" && window.html) ||
  (typeof CompactPowerCardBase?.prototype?.html === "function" &&
    CompactPowerCardBase.prototype.html) ||
  (typeof window.LitElement?.prototype?.html === "function" &&
    window.LitElement.prototype.html);

const compactPowerCardCss =
  (typeof window.css === "function" && window.css) ||
  (typeof CompactPowerCardBase?.prototype?.css === "function" &&
    CompactPowerCardBase.prototype.css) ||
  (typeof window.LitElement?.prototype?.css === "function" &&
    window.LitElement.prototype.css);

if (!CompactPowerCardBase || !compactPowerCardHtml || !compactPowerCardCss) {
  throw new Error(
    "compact-power-card: Failed to resolve Lit html/css helpers from the Home Assistant frontend."
  );
}

class CompactPowerCard extends CompactPowerCardBase {

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  get html() {
    return compactPowerCardHtml;
  }

  static getConfigForm() {
    return {
      schema: [ 
        {
          name: "",
          type: "grid",
          schema: [
            {
                name: "threshold_mode",
                selector: { 
                  select: { 
                    mode: "dropdown",
                    options: 
                      ["calculations", 
                      "display_only"],              
                  },
                },
              },
              {
                name: "decimal_places",
                selector: { number: {} },
              },                
              {
                name: "subtract_devices_from_home",
                selector: { boolean: {} },
              },  
              {
                name: "power_unit",
                selector: { 
                  select: { 
                    mode: "dropdown",
                    options: ["W", "kW", "mW"],              
                  },
                },
              },        
              {
                name: "curve_factor",
                selector: { number: { min: 0, max: 5, step: 0.5, mode: "slider" } },
              }, 
              {
                name: "font_size_multiplier",
                selector: { number: { min: 0.5, max: 2.0, step: 0.05, mode: "slider" } },
              },
              {
                name: "enable_device_power_lines",
                selector: { boolean: { } },
              },              
              {
                name: "disable_home_gradient",
                selector: { boolean: {} },
              },
              {
                name: "remove_glow_effects",
                selector: { boolean: {} },
              },
              {
                name: "hide_card_background",
                selector: { boolean: {} },
              },
          ]
        },       
        {
          name: "entities",
          title: "Power Entities & Labels",
          type: "expandable",
          flatten: false,
          schema: [
              { name: "grid", 
                title: "Grid",
                type: "expandable",
                flatten: false,
                schema: [
                  { name: "entity", id: "grid-entity", selector: { entity: {} } },   
                  { name: "",
                    type: "grid",
                    schema: [
                      {
                        name: "threshold", id: "power-threshold", title: "Power Threshold (in watts)",
                        selector: { number: { step: 1, } },
                      },                     
                      { name: "decimal_places", title: "Decimal Places", selector: { number: {} } },
                      { name: "color", selector: {text: {} } },
                      {
                        name: "unit",
                        selector: { 
                          select: { 
                            mode: "dropdown",
                            options: ["W", "kW", "mW"],              
                          },
                        },
                      },                                         
                    ]
                  },
                  { name: "invert_state_values", selector: { boolean: {} } },  
                  { name: "tap_action", 
                    selector: { 
                      select: {
                        mode: "dropdown",
                        options: ["more_info", "navigate"],
                      }
                    }
                  },  
                  {
                    name: "navigation_path",
                    selector: {
                      text: {},
                    },
                  },                          
                  { name: "labels",
                    selector: {
                      object: {
                        multiple: true,
                        label_field: "entity",
                        fields: {
                          entity: { 
                            label: "Label Entity",
                            selector: { entity: {} },
                          },
                          attribute: { 
                            label: "Entity Attribute",
                            selector: { text: {} },
                          },                          
                          name: { 
                            label: "Name Label",
                            selector: { text: {} },
                          },                           
                          icon: { 
                            label: "Icon",
                            selector: { icon: {} },
                          },                           
                          decimal_places: { 
                            label: "Decimal Places",
                            selector: { number: {} },
                          },
                          unit: { 
                            label: "Unit of Measurement",
                            selector: { text: {}},
                          },      
                          color: { 
                            label: "Colour",
                            selector: { text: {} },
                          },    
                          threshold: { 
                            label: "Threshold",
                            selector: { number: { step: "any", } },
                          },                                                                                                           
                        },
                      },
                    },
                  },                                          
                ]
              },
              { name: "pv", 
                title: "PV",
                type: "expandable",
                flatten: false,
                schema: [
                  { name: "entity", id: "pv-entity", selector: { entity: {} } },   
                  { name: "",
                    type: "grid",
                    schema: [
                      {
                        name: "threshold", id: "power-threshold", 
                        selector: { number: { step: 1, } },
                      },                      
                      { name: "decimal_places", selector: { number: {} } },
                      { name: "color", selector: {text: {} } },
                      { name: "icon", selector: { icon: {} } },
                      {
                        name: "unit",
                        selector: { 
                          select: { 
                            mode: "dropdown",
                            options: ["W", "kW", "mW"],              
                          },
                        },
                      },                                         
                    ]
                  },
                  { name: "invert_state_values", selector: { boolean: {} } },                              
                  { name: "tap_action", 
                    selector: { 
                      select: {
                        mode: "dropdown",
                        options: ["more_info", "navigate"],
                      }
                    }
                  },  
                  {
                    name: "navigation_path",
                    selector: {
                      text: {},
                    },
                  },  
                  { name: "labels",
                    selector: {
                      object: {
                        multiple: true,
                        label_field: "entity",
                        fields: {
                          entity: { 
                            label: "Label Entity",
                            selector: { entity: {} },
                          },
                          attribute: { 
                            label: "Entity Attribute",
                            selector: { text: {} },
                          },    
                          name: { 
                            label: "Name Label",
                            selector: { text: {} },
                          },                                                 
                          icon: { 
                            label: "Icon",
                            selector: { icon: {} },
                          },                           
                          decimal_places: { 
                            label: "Decimal Places",
                            selector: { number: {} },
                          },
                          unit: { 
                            label: "Unit of Measurement",
                            selector: { text: {}},
                          },      
                          color: { 
                            label: "Colour",
                            selector: { text: {} },
                          },    
                          threshold: { 
                            label: "Threshold",
                            selector: { number: { step: "any", } },
                          },                                                                                                           
                        },
                      },
                    },
                  },                                            
                ]
              },  
              { name: "battery",
                selector: {
                  object: {
                    multiple: true,
                    label_field: "entity",
                    fields: {
                      entity: { 
                        label: "Battery Power Entity",
                        selector: { entity: {} },
                      },  
                      battery_soc: { 
                        label: "Battery SoC Entity",
                        selector: { entity: {} },
                      },  
                      battery_capacity: { 
                        label: "Battery Capacity (kWh)",
                        selector: { number: { step: 0.1 } },
                      },                      
                      show_soc: {
                        label: "Show SoC Label?",
                        selector: { boolean: {} } 
                      },                                           
                      invert_state_values: {
                        label: "Invert State Values?",
                        selector: { boolean: {} } 
                      },
                      decimal_places: { 
                        label: "Decimal Places",
                        selector: { number: {} },
                      },
                      unit: { 
                        label: "Unit of Measurement",
                        selector: { 
                          select: { 
                            mode: "dropdown",
                            options: ["W", "kW", "mW"],              
                          },
                        },
                      },     
                      color: { 
                        label: "Colour",
                        selector: { text: {} },
                      },    
                      tap_action: {
                        label: "Tap Action",
                        selector: { 
                          select: {
                            mode: "dropdown",
                            options: ["more_info", "navigate"],
                          }
                        }
                      },
                      navigation_path: {
                        label: "Navigation Path",
                        selector: { text: {} },
                      },
                      threshold: { 
                        label: "Power Threshold (in watts)",
                        selector: { number: { step: 1, } },
                      },                                                                                                           
                    },
                  },
                },
              },
              { name: "battery_labels",
                selector: {
                  object: {
                    multiple: true,
                    label_field: "entity",
                    fields: {
                      entity: { 
                        label: "Label Entity",
                        selector: { entity: {} },
                      },
                      attribute: { 
                        label: "Entity Attribute",
                        selector: { text: {} },
                      },                          
                      name: { 
                        label: "Name Label",
                        selector: { text: {} },
                      },                           
                      icon: { 
                        label: "Icon",
                        selector: { icon: {} },
                      },                           
                      decimal_places: { 
                        label: "Decimal Places",
                        selector: { number: {} },
                      },
                      unit: { 
                        label: "Unit of Measurement",
                        selector: { text: {}},
                      },     
                      color: { 
                        label: "Colour",
                        selector: { text: {} },
                      },    
                      threshold: { 
                        label: "Threshold",
                        selector: { number: { step: "any", } },
                      },                                                                                                           
                    },
                  },
                },
              },                
              { name: "home", 
                title: "Home",
                type: "expandable",
                flatten: false,
                schema: [
                  { name: "entity", id: "home-entity", selector: { entity: {} } },
                  { name: "",
                    type: "grid",
                    schema: [
                      {
                        name: "threshold", id: "power-threshold", selector: { number: { step: 1, } }
                      },                      
                      { name: "decimal_places", selector: { number: {} } },
                      { name: "color", selector: {text: {} } },
                      {
                        name: "unit",
                        selector: { 
                          select: { 
                            mode: "dropdown",
                            options: ["W", "kW", "mW"],              
                          },
                        },
                      },                                         
                    ]
                  },
                  { name: "invert_state_values", selector: { boolean: {} } },                                      
                  { name: "tap_action", 
                    selector: { 
                      select: {
                        mode: "dropdown",
                        options: ["more_info", "navigate"],
                      }
                    }
                  },  
                  {
                    name: "navigation_path",
                    selector: {
                      text: {},
                    },
                  },  
                ]
              },   
              { name: "devices",
                selector: {
                  object: {
                    multiple: true,
                    label_field: "entity",
                    fields: {
                      entity: { 
                        label: "Device Power Entity",
                        selector: { entity: {} },
                      },
                      attribute: { 
                        label: "Entity Attribute",
                        selector: { text: {} },
                      },  
                      switch_entity: {
                        label: "Switch/Input Boolean Entity",
                        selector: { 
                          entity: {
                            filter: {
                              domain: ["switch", "input_boolean"],
                            },
                          } 
                        },
                      },                                                 
                      name: {
                        label: "Device Name",
                        selector: { text: {} },
                      },
                      icon: { 
                        label: "Icon",
                        selector: { icon: {} },
                      },                           
                      decimal_places: { 
                        label: "Decimal Places",
                        selector: { number: {} },
                      },
                      unit: { 
                        label: "Unit of Measurement",
                        selector: { text: {} },
                      },     
                      color: { 
                        label: "Colour",
                        selector: { text: {} },
                      },    
                      threshold: { 
                        label: "Power Threshold (in watts)",
                        selector: { number: { step: 1, } },
                      },
                      subtract_from_home: {
                        label: "Subtract from Home?",
                        selector: { boolean: {} },
                      },
                      force_hide_under_threshold: {
                        label: "Force hide device when under Threshold?",
                        selector: { boolean: {} },
                      },                                                                                                        
                    },
                  },
                },
              },                                                                  
          ]
        },               
      ],
      computeLabel: (schema) => {
        if (schema.name === "help_text") return "Settings Coming Soon";
        if (schema.name === "remove_glow_effects") return "Remove Glow Effects in Dark Mode?";
        if (schema.name === "battery") return "Batteries";
        if (schema.id === "grid-entity") return "Grid Power Entity";
        if (schema.id === "power-threshold") return "Power Threshold (in watts)";
        if (schema.id === "label-entity") return "Entity for the label";
        if (schema.id === "device-entity") return "Device Power Entity";
        if (schema.id === "pv-entity") return "PV Power Entity";
        if (schema.id === "home-entity") return "Home Power Entity";
        return undefined;
      },
      computeHelper: (schema) => {
        switch (schema.name) {
          case "help_text":
            return "some helpful text";             
        }
        return undefined;
      },
    };
  }    

  getGridOptions() {
    const ents = this._config?.entities || {};
    const hasPv = Object.prototype.hasOwnProperty.call(ents, "pv");
    const hasBattery = Object.prototype.hasOwnProperty.call(ents, "battery");
    const minRows = hasPv && hasBattery ? 3 : 2;
    return {
      rows: 3,
      columns: 12,
      min_rows: minRows,
      min_columns: 9,
    };
  }

  static getStubConfig() {
    return {
      type: "custom:compact-power-card",
      curve_factor: 1,
      entities: {
        pv: { entity: "sensor.givtcp_pv_power" },
        grid: { entity: "sensor.givtcp_grid_power" },
        battery: [ {entity: "sensor.givtcp_battery_power" }],
      },
    };
  }

  constructor() {
    super();
    this._hass = null;
    this._flowAnimations = {};
    this._homeEffective = null;
    this._homeEffectiveUnit = "W";
    this._resizeObserver = null;
    this._hostWidth = null;
    this._hostHeight = null;
    this._externalHeight = null;
    this._deviceLines = [];
    this._deviceLineStates = new Map();
    this._deviceLineFlickerTimer = null;
    this._labelFlickerStates = new Map();
    this._labelFlickerTimer = null;
    this._trackedEntityIds = new Set();
    this._lastEntityStates = new Map();
    this._lastThemeMode = null;
    this._iconPathCache = new Map();
    this._iconPathPending = new Set();
    this._pendingFlowUpdate = false;
    this._lastFlowLayoutKey = null;
    this._layoutReady = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (this._shouldUpdateForHass(hass)) {
      this._updateFlows();
      this.requestUpdate();
    }
  }

  get hass() {
    return this._hass;
  }

  setConfig(config) {
    if (
      !config.entities ||
      typeof config.entities !== "object" ||
      Array.isArray(config.entities)
    ) {
      throw new Error(
        "compact-power-card: 'entities' must be an object with keys pv, grid, home, battery"
      );
    }
    this._config = config;
    const fontScaleRaw = this._parseNumberStrict(this._config?.font_size_multiplier);
    const fontScale = Number.isFinite(fontScaleRaw)
      ? Math.min(2.0, Math.max(0.5, fontScaleRaw))
      : 1;
    this.style.setProperty("--cpc-text-scale", String(fontScale));
    this._trackedEntityIds = this._collectEntityIds();
    this._lastEntityStates.clear();
    this._lastThemeMode = null;
  }

  static get styles() {
    return compactPowerCardCss`
      :host {
        --cpc-scale: 1;
        --cpc-text-scale: 1;
        display: block;
        height: 100%;
      }

      ha-card {
        box-sizing: border-box;
        padding: 0 4px 2px;
        background: var(--ha-card-background, var(--card-background-color));
        box-shadow: var(--ha-card-box-shadow);
        position: relative;
        height: 100%;
      }

      ha-card.transparent {
        background: transparent;
        box-shadow: none;
        border: none;
      }

      .canvas {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      ha-card.layout-ready .canvas {
        opacity: 1;
      }

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      text {
        font-family: inherit;
      }

      .flow-line {
        stroke-width: 2;
        stroke-linecap: round;
        stroke: #7a7a7a;
        stroke-opacity: 0.15;
        transition: stroke 0.3s ease, stroke-opacity 0.3s ease;
        vector-effect: non-scaling-stroke;
      }

      .device-line {
        fill: none;
        stroke-linecap: round;
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
        stroke-opacity: var(--device-line-opacity, 1);
      }

      .device-line-flicker {
        animation: deviceLineFlicker 0.5s ease-out 1;
      }

      .device-label-flicker {
        animation: deviceLabelFlicker 0.5s ease-out 1;
      }

      .device-icon-ring {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(24px * var(--cpc-scale, 1));
        height: calc(24px * var(--cpc-scale, 1));
        position: relative;
      }

      .device-icon-ring.switchable {
        overflow: visible;
      }

      .device-icon-ring.switchable::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: calc(-3px * var(--cpc-scale, 1));
        border-bottom: 2px dotted currentColor;
        opacity: 0.35;
        pointer-events: none;
      }

      .device-icon-ring.switchable.on::after {
        border-bottom-style: solid;
        opacity: 1;
      }

      .label-flicker {
        animation: labelFlicker 0.5s ease-out 1;
      }

      @keyframes deviceLineFlicker {
        0% { stroke-opacity: 1; }
        25% { stroke-opacity: var(--device-line-opacity, 1); }
        45% { stroke-opacity: 0.9; }
        70% { stroke-opacity: var(--device-line-opacity, 1); }
        100% { stroke-opacity: var(--device-line-opacity, 1); }
      }

      @keyframes deviceLabelFlicker {
        0% { opacity: 1; }
        25% { opacity: var(--device-label-opacity, 1); }
        45% { opacity: 0.9; }
        70% { opacity: var(--device-label-opacity, 1); }
        100% { opacity: var(--device-label-opacity, 1); }
      }

      @keyframes labelFlicker {
        0% { opacity: 1; }
        25% { opacity: var(--label-opacity, 1); }
        45% { opacity: 0.9; }
        70% { opacity: var(--label-opacity, 1); }
        100% { opacity: var(--label-opacity, 1); }
      }

      .pv-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 0;
        gap: 2px;
      }

      .pv-label {
        font-size: calc(16px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
      }

      .node-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        user-select: none;
      }

      .pv-marker {
        gap: 0px;
      }

      .pv-marker .node-label {
        transform: translateY(4px);
      }

      .node-marker.left {
        align-items: flex-start;
      }

      .node-marker.right {
        align-items: flex-end; /* keep battery icon pinned right while label grows */
      }

      .battery-marker {
        gap: 0;
        position: relative;
      }

      .grid-marker {
        gap: 0;
      }

      .pv-icon-wrap {
        position: relative;
        width: calc(32px * var(--cpc-scale, 1));
        height: calc(32px * var(--cpc-scale, 1));
        margin-top: 4px;
      }

      .pv-icon-circle {
        position: absolute;
        inset: 0;
        background: var(--ha-card-background, var(--card-background-color));
        border: 2px solid var(--cpc-pv-icon-stroke, #ff0000);
        border-radius: 50%;
        box-sizing: border-box;
      }

      .pv-icon {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
      }

      .pv-icon-wrap.custom .pv-icon {
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 6px;
      }

      .battery-icon-wrap {
        position: relative;
        width: calc(32px * var(--cpc-scale, 1));
        height: calc(32px * var(--cpc-scale, 1));
        margin-top: 4px;
      }

      .battery-icon-circle {
        position: absolute;
        inset: 0;
        background: var(--ha-card-background, var(--card-background-color));
        border: 2px solid var(--cpc-battery-icon-stroke, #ff0000);
        border-radius: 50%;
        box-sizing: border-box;
      }

      .battery-icon {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
      }

      .battery-icon-wrap.custom .battery-icon {
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 6px;
      }
    `;
  }
}
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
      return { cfg: b, value, unit, watts };
    });
    const homeMeta = this._getPowerMeta(homeCfg.entity, homeUnit);

    const pvRawW = pvMeta.watts;
    const pvCalcW = useThresholdForCalc ? applyThreshold(pvRawW, pvThreshold) : pvRawW;
    const pv = Math.max(pvCalcW, 0);

    const gridWatts = Number.isFinite(gridMeta?.watts) ? gridMeta.watts : 0;
    const gridBaseW = invertGridEffective ? -gridWatts : gridWatts;
    batteryComputed = batteryItems.map((item) => {
      const cfg = item.cfg || {};
      const hasDirectional =
        Boolean(cfg?.charge_entity || cfg?.discharge_entity || cfg?.chargeEntity || cfg?.dischargeEntity);
      const invert = !hasDirectional && Boolean(cfg?.invert_state_values || invertBattery);
      const thr = this._toWatts(this._parseThreshold(cfg.threshold), "W", true);
      const raw = invert ? -item.watts : item.watts;
      const effective = useThresholdForCalc ? applyThreshold(raw, thr) : raw;
      return { cfg, raw, effective, threshold: thr, unit: item.unit };
    });

    const batteryBaseW = batteryComputed.reduce((sum, item) => sum + item.effective, 0);
    const batteryBaseRawW = batteryComputed.reduce((sum, item) => sum + item.raw, 0);

    const grid = useThresholdForCalc ? applyThreshold(gridBaseW, gridThreshold) : gridBaseW;
    const homeRawW = homeMeta.watts;
    const battery = batteryBaseW;

    // Flows always respect thresholds for visibility/animation
    const pvFlow = Math.max(applyThreshold(pvRawW, pvThreshold), 0);
    const gridFlow = applyThreshold(gridBaseW, gridThreshold);
    const batteryFlow = applyThreshold(batteryBaseW, batteryThreshold);

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
        this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
        "";
      const srcMeta = this._getPowerMeta(entity, srcUnit, attribute);
      if (!Number.isFinite(srcMeta.watts)) continue;
      const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
      const valForCalc = useThresholdForCalc ? applyThreshold(srcMeta.watts, thr) : srcMeta.watts;
      if (valForCalc > 0) auxUsage += valForCalc;
    }

    const hasHomeEntity = Boolean(homeCfg?.entity);
    const baseHome = Number.isFinite(homeRawW) ? homeRawW : 0;
    const inferredBase = pv + battery - grid;
    const allowSubtract = subtractFromHome || hasPerDeviceInclude;
    let homeEffectiveDisplay = 0;
    let homeEffectiveFlow = 0;
    if (hasHomeEntity) {
      const adjustedHome = allowSubtract ? baseHome - auxUsage : baseHome;
      homeEffectiveDisplay = Math.max(adjustedHome, 0);
      homeEffectiveFlow = Math.max(inferredBase, 0);
    } else {
      const inferredDisplay = Math.max(allowSubtract ? inferredBase - auxUsage : inferredBase, 0);
      homeEffectiveDisplay = inferredDisplay;
      homeEffectiveFlow = Math.max(inferredBase, 0);
    }
    this._homeEffective = homeEffectiveDisplay;
    this._homeEffectiveUnit = "W";

    const pvColor = this._getColor("pv", pvCfg);
    const gridColor = this._getColor("grid", gridCfg);
    const homeColor = this._getColor("home", homeCfg);
    const batteryColor = this._getColor("battery", batteryCfg);

    const threshold = 0;
    const gridImportThreshold = 0;
    const baseDuration = 1500;

    const parseLineGeom = (id, fallback, reverse = false) => {
      const el = this.shadowRoot?.getElementById(id);
      if (!el) return fallback;
      const x1 = Number(el.getAttribute("x1"));
      const y1 = Number(el.getAttribute("y1"));
      const x2 = Number(el.getAttribute("x2"));
      const y2 = Number(el.getAttribute("y2"));
      if ([x1, y1, x2, y2].every((v) => Number.isFinite(v))) {
        if (reverse) {
          return { mode: "line", x1: x2, y1: y2, x2: x1, y2: y1 };
        }
        return { mode: "line", x1, y1, x2, y2 };
      }
      return fallback;
    };

    const parsePathGeom = (id, fallback, reverse = false) => {
      const el = this.shadowRoot?.getElementById(id);
      if (!el || !el.getTotalLength) return fallback;
      return { mode: "path", pathId: id, fallback, reverse };
    };

    const allLines = [
      "line-pv-grid",
      "line-pv-home",
      "line-pv-battery",
      "line-grid-home",
      "line-home-battery",
      "arc-grid-battery",
    ];
    const lineBaseColors = {
      "line-pv-grid": pvColor,
      "line-pv-home": pvColor,
      "line-pv-battery": pvColor,
      "line-grid-home": gridColor,
      "line-home-battery": pvInBatterySlot ? pvColor : batteryColor,
      "arc-grid-battery": pvInBatterySlot ? pvColor : gridColor,
    };
    for (const id of allLines) {
      const baseColor = lineBaseColors[id] || "#7a7a7a";
      this._setLineColor(id, baseColor, false);
    }

    // Geometry helpers consistent with render()
    const layout = this._getLayoutMetrics({
      hasPv:
        this._config?.entities &&
        Object.prototype.hasOwnProperty.call(this._config.entities, "pv"),
      hasBattery,
      hasAnyLabels,
    });
    const {
      baseWidth,
      renderScaleY,
      homeCenterX,
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
    const gridBatteryCtrlX = baseWidth / 2; // keep hump centered near home/PV line
    const gridBatteryCtrlY = gridNodeY - humpHeightAdj; // fixed hump height (screen px)

    // Straight-line geometry between anchor points
    const gridBatteryGeom = curvedLines
      ? {
          mode: "path",
          pathId: "arc-grid-battery",
          fallback: { mode: "line", x1: gridNode.x, y1: gridNode.y, x2: batteryNode.x, y2: batteryNode.y },
          ctrlX: gridBatteryCtrlX,
          ctrlY: gridBatteryCtrlY,
        }
      : { mode: "line", x1: gridNode.x, y1: gridNode.y, x2: batteryNode.x, y2: batteryNode.y };
    const batteryGridGeom = curvedLines
      ? {
          mode: "path",
          pathId: "arc-grid-battery",
          fallback: { mode: "line", x1: batteryNode.x, y1: batteryNode.y, x2: gridNode.x, y2: gridNode.y },
          ctrlX: gridBatteryCtrlX,
          ctrlY: gridBatteryCtrlY,
        }
      : { mode: "line", x1: batteryNode.x, y1: batteryNode.y, x2: gridNode.x, y2: gridNode.y };

    const geom = {
      // Grid → PV: right angle (horizontal then vertical), same anchors
      "pv-grid": {
        mode: "path",
        pathId: "line-pv-grid",
        fallback: { mode: "line", x1: gridNode.x, y1: gridPvStartY, x2: pvGridEndX, y2: pvNode.y },
      },
      "pv-home": { mode: "line", x1: pvNode.x, y1: pvNode.y, x2: homeNode.x, y2: homeNode.y },
      // PV → Battery: right angle (horizontal then vertical), same anchors
      "pv-battery": {
        mode: "path",
        pathId: "line-pv-battery",
        fallback: { mode: "line", x1: pvBatteryStartX, y1: pvNode.y, x2: batteryNode.x, y2: pvBatteryEndY },
      },

      // Grid → Home: right angle (horizontal then vertical), same anchors
      "grid-home": {
        mode: "path",
        pathId: "line-grid-home",
        fallback: { mode: "line", x1: gridNode.x, y1: gridHomeStartY, x2: gridHomeEndX, y2: homeNode.y },
      },
      // Battery → Home: right angle (horizontal then vertical), same anchors
      "battery-home": {
        mode: "path",
        pathId: "line-home-battery",
        fallback: { mode: "line", x1: batteryNode.x, y1: batteryHomeStartY, x2: batteryHomeEndX, y2: homeNode.y },
      },

      "grid-battery": gridBatteryGeom,
      "battery-grid": batteryGridGeom,
    };

    // Let flow dots follow the current drawn geometry (lines/paths) when updated.
    geom["pv-grid"] = parsePathGeom(
      "line-pv-grid",
      { mode: "line", x1: gridNode.x, y1: gridPvStartY, x2: pvGridEndX, y2: pvNode.y },
      true
    );
    geom["pv-battery"] = parsePathGeom(
      "line-pv-battery",
      { mode: "line", x1: pvBatteryStartX, y1: pvNode.y, x2: batteryNode.x, y2: pvBatteryEndY },
      false
    );
    geom["pv-home"] = parseLineGeom("line-pv-home", geom["pv-home"]);
    geom["grid-battery"] = curvedLines
      ? parsePathGeom(
          "arc-grid-battery",
          {
            mode: "quad",
            x0: gridNode.x,
            y0: gridNode.y,
            cx: gridBatteryCtrlX,
            cy: gridBatteryCtrlY,
            x1: batteryNode.x,
            y1: batteryNode.y,
          },
          false
        )
      : gridBatteryGeom;
    geom["battery-grid"] = curvedLines
      ? parsePathGeom(
          "arc-grid-battery",
          {
            mode: "quad",
            x0: batteryNode.x,
            y0: batteryNode.y,
            cx: gridBatteryCtrlX,
            cy: gridBatteryCtrlY,
            x1: gridNode.x,
            y1: gridNode.y,
          },
          true
        )
      : batteryGridGeom;
    geom["grid-home"] = parsePathGeom(
      "line-grid-home",
      { mode: "line", x1: gridNode.x, y1: gridHomeStartY, x2: gridHomeEndX, y2: homeNode.y },
      false
    );
    geom["battery-home"] = parsePathGeom(
      "line-home-battery",
      { mode: "line", x1: batteryNode.x, y1: batteryHomeStartY, x2: batteryHomeEndX, y2: homeNode.y },
      false
    );

    const lineIdMap = {
      "pv-grid": "line-pv-grid",
      "pv-home": "line-pv-home",
      "pv-battery": "line-pv-battery",
      "grid-home": "line-grid-home",
      "battery-home": "line-home-battery",
      "grid-battery": "arc-grid-battery",
      "battery-grid": "arc-grid-battery",
    };

    const active = {};

    // Flow priorities (see Power Flow Rules):
    // PV: home → battery (charge) → export
    // Battery (discharge): home → export
    // Grid (import): home → battery (charge), only after PV/battery
    const gridImport = gridFlow < 0 ? -gridFlow : 0;
    const gridExport = gridFlow > 0 ? gridFlow : 0;
    const battDischarge = batteryFlow > 0 ? batteryFlow : 0;
    const battCharge = batteryFlow < 0 ? -batteryFlow : 0;

    let homeNeed = Math.max(homeEffectiveFlow, 0);
    let chargeNeed = battCharge;

    const forceCharge = battCharge > 0 && gridImport > 0;

    let pvToHome = 0;
    let pvToBattery = 0;
    let pvToGrid = 0;

    if (forceCharge) {
      // Forced charge: PV charges battery before serving home.
      pvToBattery = Math.min(pvFlow, chargeNeed);
      chargeNeed -= pvToBattery;
      let pvRemaining = pvFlow - pvToBattery;
      pvToHome = Math.min(pvRemaining, homeNeed);
      homeNeed -= pvToHome;
      pvRemaining -= pvToHome;
      pvToGrid = Math.min(pvRemaining, gridExport);
    } else {
      // PV → home, then battery charge, then export
      pvToHome = Math.min(pvFlow, homeNeed);
      homeNeed -= pvToHome;
      let pvRemaining = pvFlow - pvToHome;
      pvToBattery = Math.min(pvRemaining, chargeNeed);
      pvRemaining -= pvToBattery;
      chargeNeed -= pvToBattery;
      pvToGrid = Math.min(pvRemaining, gridExport);
    }

    // Battery discharge → remaining home, then export (only what PV export didn't cover)
    const batteryToHome = Math.min(battDischarge, homeNeed);
    homeNeed -= batteryToHome;
    const battDischargeAfterHome = Math.max(battDischarge - batteryToHome, 0);
    const batteryToGrid = Math.min(battDischargeAfterHome, Math.max(gridExport - pvToGrid, 0));

    // Grid import → remaining home, then remaining battery charge
    const gridToHome = Math.min(gridImport, homeNeed);
    homeNeed -= gridToHome;
    const gridImportRemaining = Math.max(gridImport - gridToHome, 0);
    const gridToBattery = Math.min(gridImportRemaining, chargeNeed);
    chargeNeed -= gridToBattery;

    this._setHomeGradient(
      pvToHome,
      batteryToHome,
      gridToHome,
      pvColor,
      batteryColor,
      gridColor,
      homeColor
    );

    const pvHomeKey = pvInBatterySlot ? "battery-home" : "pv-home";
    const pvGridKey = pvInBatterySlot ? "battery-grid" : "pv-grid";
    if (pvToHome > threshold)
      active[pvHomeKey] = { geom: geom[pvHomeKey], magnitude: pvToHome, color: pvColor };
    if (!pvInBatterySlot && pvToBattery > threshold)
      active["pv-battery"] = { geom: geom["pv-battery"], magnitude: pvToBattery, color: pvColor };
    if (pvToGrid > threshold)
      active[pvGridKey] = { geom: geom[pvGridKey], magnitude: pvToGrid, color: pvColor };

    if (gridToHome > gridImportThreshold)
      active["grid-home"] = {
        geom: geom["grid-home"],
        magnitude: gridToHome,
        color: gridColor,
      };
    if (gridToBattery > gridImportThreshold)
      active["grid-battery"] = {
        geom: geom["grid-battery"],
        magnitude: gridToBattery,
        color: gridColor,
      };

    if (batteryToHome > threshold)
      active["battery-home"] = {
        geom: geom["battery-home"],
        magnitude: batteryToHome,
        color: batteryColor,
      };
    if (batteryToGrid > threshold)
      active["battery-grid"] = {
        geom: geom["battery-grid"],
        magnitude: batteryToGrid,
        color: batteryColor,
      };

    // Fallback: if battery is discharging but no line was activated (PV/grid covered needs),
    // still show a battery → home flow so discharge is visible.
    if (
      battDischarge > threshold &&
      !active["battery-home"] &&
      !active["battery-grid"]
    ) {
      active["battery-home"] = {
        geom: geom["battery-home"],
        magnitude: battDischarge,
        color: batteryColor,
      };
    }


    let maxFlow = 0;
    for (const f of Object.values(active)) {
      if (f.magnitude > maxFlow) maxFlow = f.magnitude;
    }
    if (maxFlow <= 0) maxFlow = 0;

    const allNames = [
      "pv-home",
      "pv-battery",
      "pv-grid",
      "grid-home",
      "grid-battery",
      "battery-home",
      "battery-grid",
    ];

    for (const name of allNames) {
      const meta = active[name];
      if (meta && maxFlow > 0) {
        const id = lineIdMap[name];
        if (id) this._setLineColor(id, meta.color, true);

        const rawRatio = maxFlow / meta.magnitude;
        const factor = Math.min(Math.max(rawRatio, 1), 4);
        const duration = baseDuration * factor;

        this._startFlow(name, meta.geom, duration);
      } else {
        this._stopFlow(name);
      }
    }
  }

  _startFlow(name, geom, duration) {
    if (!this._flowAnimations) this._flowAnimations = {};

    const existing = this._flowAnimations[name];
    if (existing && existing.active) {
      existing.geom = geom;
      if (Number.isFinite(duration)) {
        existing.pendingDuration = duration;
      }
      if (geom?.mode === "path") {
        existing.pathEl = null;
        existing.pathLength = 0;
      }
      return;
    }

    const dot = this.shadowRoot.getElementById(`dot-${name}`);
    if (!dot) return;
    dot.setAttribute("opacity", "1");

    const animState = {
      active: true,
      frameId: null,
      start: null,
      geom,
      duration,
      pendingDuration: null,
      lastPhase: 0,
    };
    if (name === "pv-home") {
      animState.lockCXPercent = "50%";
    }

    const step = (timestamp) => {
      if (!animState.active) return;
      if (animState.start === null) animState.start = timestamp;

      const d = animState.duration || 1500;
      const elapsed = (timestamp - animState.start) % d;
      const t = elapsed / d;
      if (animState.pendingDuration != null && t < animState.lastPhase) {
        animState.duration = animState.pendingDuration;
        animState.pendingDuration = null;
        animState.start = timestamp;
      }
      animState.lastPhase = t;
      const fadeInEnd = 0.05;
      const fadeOutStart = 0.85;
      let opacity = 1;
      if (t <= fadeInEnd) {
        opacity = Math.min(1, t / fadeInEnd);
      } else if (t >= fadeOutStart) {
        opacity = Math.max(0, 1 - (t - fadeOutStart) / (1 - fadeOutStart));
      }

      let cx, cy;

      if (animState.geom.mode === "quad") {
        const { x0, y0, cx: qx, cy: qy, x1, y1 } = animState.geom;
        const inv = 1 - t;
        cx = inv * inv * x0 + 2 * inv * t * qx + t * t * x1;
        cy = inv * inv * y0 + 2 * inv * t * qy + t * t * y1;
      } else if (animState.geom.mode === "path") {
        if (!animState.pathEl) {
          animState.pathEl = this.shadowRoot?.getElementById(animState.geom.pathId);
          animState.pathD = animState.pathEl?.getAttribute?.("d") || null;
          animState.pathLength = animState.pathEl?.getTotalLength?.() || 0;
        } else {
          const nextD = animState.pathEl.getAttribute?.("d") || null;
          if (nextD && nextD !== animState.pathD) {
            animState.pathD = nextD;
            animState.pathLength = animState.pathEl.getTotalLength?.() || 0;
          }
        }
        if (animState.pathEl && animState.pathLength > 0) {
          const pos = animState.geom.reverse ? 1 - t : t;
          const pt = animState.pathEl.getPointAtLength(animState.pathLength * pos);
          cx = pt.x;
          cy = pt.y;
        } else {
          const { x1, y1, x2, y2 } = animState.geom.fallback || animState.geom;
          const pos = animState.geom.reverse ? 1 - t : t;
          cx = x1 + (x2 - x1) * pos;
          cy = y1 + (y2 - y1) * pos;
        }
      } else {
        const { x1, y1, x2, y2, reverse } = animState.geom;
        const pos = reverse ? 1 - t : t;
        cx = x1 + (x2 - x1) * pos;
        cy = y1 + (y2 - y1) * pos;
      }

      if (animState.lockCXPercent) {
        dot.setAttribute("cx", animState.lockCXPercent);
      } else {
        dot.setAttribute("cx", String(cx));
      }
      dot.setAttribute("cy", String(cy));
      dot.setAttribute("opacity", opacity.toFixed(2));

      animState.frameId = requestAnimationFrame(step);
    };

    animState.frameId = requestAnimationFrame(step);
    this._flowAnimations[name] = animState;
  }

  _stopFlow(name) {
    if (!this._flowAnimations || !this._flowAnimations[name]) return;
    const state = this._flowAnimations[name];
    state.active = false;
    if (state.frameId) cancelAnimationFrame(state.frameId);

    const dot = this.shadowRoot.getElementById(`dot-${name}`);
    if (dot) dot.setAttribute("opacity", "0");

    delete this._flowAnimations[name];
  }

  _openMoreInfo(entityId) {
    if (!entityId || !this.hass) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _navigate(path) {
    if (!path) return;
    if (this.hass?.navigate) {
      this.hass.navigate(path);
      return;
    }
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
  }

  _handleTapAction(cfg, entityId) {
    const action = String(cfg?.tap_action || "more_info").toLowerCase();
    if (action === "navigate") {
      const path = cfg?.navigation_path || cfg?.navigationPath || null;
      if (path) {
        this._navigate(path);
        return;
      }
    }
    this._openMoreInfo(entityId);
  }

  _toggleEntity(entityId) {
    if (!entityId || !this.hass) return;
    const [domain] = String(entityId).split(".");
    if (!domain) return;
    this.hass.callService(domain, "toggle", { entity_id: entityId });
  }

  _toggleDeviceSwitch(src) {
    if (!src?.switchEntity) return;
    this._toggleEntity(src.switchEntity);
  }

  render() {
    const html = this.html;

    const pvCfg = this._getEntityConfig("pv");
    const hasPv =
      this._config?.entities &&
      Object.prototype.hasOwnProperty.call(this._config.entities, "pv");
    const gridCfg = this._getEntityConfig("grid");
    const homeCfg = this._getEntityConfig("home");
    const batteryRaw = this._getEntityConfig("battery");
    const batteryList = Array.isArray(batteryRaw)
      ? batteryRaw
      : batteryRaw
      ? [batteryRaw]
      : [{ entity: null }];
    const batteryCfg = batteryList[0] || { entity: null };
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
    const pvInBatterySlot = !hasBattery && Boolean(pvCfg?.entity);
    const invertGrid = Boolean(gridCfg?.invert_state_values);
    const invertBattery = Boolean(batteryCfg?.invert_state_values);
    const gridUsesDirectional =
      Boolean(gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity);
    const invertGridEffective = invertGrid && !gridUsesDirectional;
    const pvLabels = this._normalizeLabels(pvCfg?.labels, null);
    const batteryLabelsSource = Array.isArray(this._config?.entities?.battery)
      ? this._config?.entities?.battery_labels || this._config?.entities?.battery?.labels
      : batteryCfg?.labels;
    const batteryLabels = this._normalizeLabels(batteryLabelsSource, null);
    const { sources: normalizedSources } = this._getSourcesConfig();
    const enableDevicePowerLines = this._useDevicePowerLines();
    const allowGlow = this._allowGlowEffects();
    const homeGlowOpacity = allowGlow ? 0.3 : 0;
    const homeTapAction = String(homeCfg?.tap_action || "more_info").toLowerCase();
    const homeNavigatePath = homeCfg?.navigation_path || homeCfg?.navigationPath || null;
    const homeCanNavigate = homeTapAction === "navigate" && Boolean(homeNavigatePath);
    const homeClickable = Boolean(homeCfg?.entity) || homeCanNavigate;
    const homeIconId = homeCfg?.icon || "mdi:home";
    const hasHomeIconOverride = Boolean(homeCfg?.icon);
    const homeIconPath =
      this._getMdiPath(homeIconId) || "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z";
    const pvIconId = pvCfg?.icon || "mdi:solar-panel";
    const hasPvIconOverride = Boolean(pvCfg?.icon);
    const pvIconPath = this._getMdiPath(pvIconId) || this._getMdiPath("mdi:solar-panel");
    const gridIconId = gridCfg?.icon || "mdi:transmission-tower";
    const hasGridIconOverride = Boolean(gridCfg?.icon);
    const gridIconPath =
      this._getMdiPath(gridIconId) || this._getMdiPath("mdi:transmission-tower");
    const gridLabelsRaw = this._normalizeLabels(gridCfg?.labels, null);
    const batteryLabelsRaw = this._normalizeLabels(batteryLabelsSource, null);
    const hasAnyLabels =
      pvLabels.length > 0 || gridLabelsRaw.length > 0 || batteryLabelsRaw.length > 0;
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
      viewHeight,
      renderScaleY,
      xScale,
      yScale,
      hostRect,
      rowCount,
      columnCount,
      maxItemsByColumns,
      anchorLeftX,
      sx,
      yOffset,
      syTop,
      sy,
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
      humpHeight,
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
    const deviceYOffset =
      (this._shouldUseExternalHeight() && rowCount < 3) ||
      (!this._shouldUseExternalHeight() && (!hasPv || !hasBattery))
        ? 20
        : 0;
    const labelBonus = !hasPv || !hasBattery ? (rowCount >= 4 ? 2 : 1) : 0;
    const gridBatteryBonus =
      hasPv && hasBattery && pvLabels.length <= 4
        ? (rowCount >= 4 ? 2 : 1)
        : hasPv && hasBattery && rowCount >= 5
        ? 1
        : 0;
    const gridLabelMax =
      rowCount <= 2
        ? Math.max(0, rowCount - 1 + labelBonus + gridBatteryBonus)
        : rowCount <= 4
        ? 2 + labelBonus + gridBatteryBonus
        : Math.max(
            0,
            rowCount -
              2 +
              labelBonus +
              gridBatteryBonus +
              (rowCount >= 7 ? 1 : 0) +
              (rowCount >= 8 ? 1 : 0)
          );
    const gridLabels = this._normalizeLabels(gridCfg?.labels, gridLabelMax);
    const batteryLabelMax =
      rowCount <= 2
        ? Math.max(0, rowCount - 1 + labelBonus + gridBatteryBonus)
        : rowCount <= 4
        ? 2 + labelBonus + gridBatteryBonus
        : Math.max(
            0,
            rowCount -
              2 +
              labelBonus +
              gridBatteryBonus +
              (rowCount >= 7 ? 1 : 0) +
              (rowCount >= 8 ? 1 : 0)
          );
    const showDeviceNames = rowCount >= 4;
    const showPvLabelNames = rowCount >= 4;
    const widthScale = 1;
    const iconOffset = 26 * widthScale;
    const gridIconX = gridLineStartX - iconOffset; // offset from line start, scale with width
    const batteryIconX = gridLineEndX + iconOffset; // offset from line end, scale with width
    const pctBaseY = (v) => ((sy(v)) / viewHeight) * 100; // PV: stay near top as view grows
    const pctGridY = (v) => ((syGridBatt(v)) / viewHeight) * 100;
    const pctGridFixed = (v) => (sy(v) / viewHeight) * 100; // keep label anchors stable when height grows
    const pctHomeY = (v) => ((syHome(v)) / viewHeight) * 100;

    const pvDecimals = this._getDecimalPlaces(pvCfg);
    const gridDecimals = this._getDecimalPlaces(gridCfg);
    const batteryDecimals = this._getDecimalPlaces(batteryCfg);
    const homeDecimals = this._getDecimalPlaces(homeCfg);

    const pvUnitOverride = this._getUnitOverride(pvCfg);
    const gridUnitOverride = this._getUnitOverride(gridCfg);
    const batteryUnitOverride = this._getUnitOverride(batteryCfg);
    const homeUnitOverride = this._getUnitOverride(homeCfg);

    const pvUnitRaw =
      this.hass?.states?.[pvCfg.entity]?.attributes?.unit_of_measurement || "";
    const gridMeta = this._getGridPowerMeta(gridCfg, gridUnitOverride ?? null);
    const gridUnitRaw =
      gridMeta?.unit ||
      this.hass?.states?.[gridCfg.entity]?.attributes?.unit_of_measurement ||
      "";
    const batteryUnitRaw =
      batteryList
        .map((cfg) => this._getBatteryPowerMeta(cfg)?.unit ||
          (cfg.entity && this.hass?.states?.[cfg.entity]?.attributes?.unit_of_measurement) || "")
        .find((u) => u) || "";

    // Numeric values in watts
    const pvNumeric = this._getNumeric(pvCfg.entity);
    const homeNumeric = this._getNumeric(homeCfg.entity);
    const pvNumericW = this._toWatts(pvNumeric, pvUnitRaw);
    const gridNumericRaw = gridMeta?.value ?? this._getNumeric(gridCfg.entity);
    const gridNumeric = invertGridEffective ? -gridNumericRaw : gridNumericRaw;
    const gridNumericW = Number.isFinite(gridMeta?.watts)
      ? (invertGridEffective ? -gridMeta.watts : gridMeta.watts)
      : this._toWatts(gridNumeric, gridUnitRaw);

    const thresholdMode = String(this._config?.threshold_mode || "calculations").toLowerCase();
    const useThresholdForCalc = thresholdMode === "calculations";
    const applyThreshold = (value, threshold) => {
      if (threshold == null) return value;
      return this._isThresholdSuppressed(value, threshold) ? 0 : value;
    };

    const pvDisplayUnit = "W";
    const pvState = this.hass?.states?.[pvCfg.entity]?.state;
    const pvVal = Number.isFinite(pvNumericW)
      ? this._formatPowerWithOverride(pvNumericW, pvDecimals, pvDisplayUnit, pvUnitOverride ?? null)
      : this._formatEntity(pvCfg.entity, pvDecimals, null, pvUnitOverride);
    const gridDisplayUnit = "W";
    const battUnit = "W";
    const battSocEntity = null;
    const battSocLabel = null;
    const batteryShowSoc = Boolean(batteryCfg?.show_soc);
    const batteryItems = batteryList.map((cfg) => {
      const meta = this._getBatteryPowerMeta(cfg);
      const unit =
        meta?.unit ||
        (cfg.entity && this.hass?.states?.[cfg.entity]?.attributes?.unit_of_measurement) ||
        "";
      const raw = meta?.value != null ? meta.value : this._getNumeric(cfg.entity);
      const hasDirectional =
        Boolean(cfg?.charge_entity || cfg?.discharge_entity || cfg?.chargeEntity || cfg?.dischargeEntity);
      const inverted = (!hasDirectional && (cfg?.invert_state_values || invertBattery)) ? -raw : raw;
      const rawW = Number.isFinite(meta?.watts)
        ? (!hasDirectional && (cfg?.invert_state_values || invertBattery) ? -meta.watts : meta.watts)
        : this._toWatts(inverted, unit);
      const thr = this._toWatts(this._parseThreshold(cfg.threshold), "W", true);
      const effective = useThresholdForCalc ? applyThreshold(rawW, thr) : rawW;
      return { cfg, raw: rawW, effective, threshold: thr, unit };
    });
    const batteryComputed = batteryItems;
    const battNumericW = batteryItems.reduce((sum, item) => sum + item.effective, 0);
    const pvThresholdDisplay = this._toWatts(this._parseThreshold(pvCfg.threshold), "W", true);
    const gridThresholdDisplay = this._toWatts(this._parseThreshold(gridCfg.threshold), "W", true);
    const batteryThresholdDisplay = this._toWatts(
      this._parseThreshold(batteryCfg.threshold),
      "W",
      true
    );
    const renderValue = (text) => {
      if (!text) return text;
      const m = /^([+-]?\d[\d.,]*)(\s+.+)?$/.exec(String(text));
      if (!m) {
        const s = String(text);
        const spaceIdx = s.indexOf(" ");
        const head = spaceIdx === -1 ? s : s.slice(0, spaceIdx);
        const tail = spaceIdx === -1 ? "" : s.slice(spaceIdx);
        return html`<span class="value-number">${head}</span>${tail
          ? html`<span class="value-unit">${tail}</span>`
          : ""}`;
      }
      const num = m[1];
      const rest = m[2] || "";
      return html`<span class="value-number">${num}</span>${rest
        ? html`<span class="value-unit">${rest}</span>`
        : ""}`;
    };
    const gridState = this.hass?.states?.[gridCfg.entity]?.state;
    let gridVal = Number.isFinite(gridNumericW)
      ? this._formatPowerWithOverride(Math.abs(gridNumericW), gridDecimals, gridDisplayUnit, gridUnitOverride ?? null)
      : gridState;
    let gridArrow = null;
    if (Number.isFinite(gridNumericW)) {
      gridArrow =
        gridNumericW > 0
          ? "mdi:arrow-left"
          : gridNumericW < 0
          ? "mdi:arrow-right"
          : null;
    }

    const gridImportEntity = gridCfg?.import_entity || gridCfg?.importEntity;
    const gridExportEntity = gridCfg?.export_entity || gridCfg?.exportEntity;
    const gridHasBothDirectional = Boolean(gridImportEntity && gridExportEntity);
    let gridValDisplay = null;
    if (gridHasBothDirectional) {
      const importUnit =
        this.hass?.states?.[gridImportEntity]?.attributes?.unit_of_measurement || gridUnitRaw;
      const exportUnit =
        this.hass?.states?.[gridExportEntity]?.attributes?.unit_of_measurement || gridUnitRaw;
      const importNum = this._getNumeric(gridImportEntity);
      const exportNum = this._getNumeric(gridExportEntity);
      const gridImportW = gridMeta?.importWatts ?? this._toWatts(importNum, importUnit);
      const gridExportW = gridMeta?.exportWatts ?? this._toWatts(exportNum, exportUnit);
      const gridImportFormatted = this._formatPowerWithOverride(
        Math.abs(gridImportW),
        gridDecimals,
        gridDisplayUnit,
        gridUnitOverride ?? null
      );
      const gridExportFormatted = this._formatPowerWithOverride(
        Math.abs(gridExportW),
        gridDecimals,
        gridDisplayUnit,
        gridUnitOverride ?? null
      );

      gridValDisplay = html`
        <span style="display: inline-flex; align-items: center; gap: 4px;">
          <ha-icon class="inline-icon" icon="mdi:arrow-right" style="color:${gridColor}; opacity:${gridOpacity};"></ha-icon>
          ${renderValue(gridImportFormatted)}
          <span style="margin: 0 2px; opacity: 0.5;">|</span>
          <ha-icon class="inline-icon" icon="mdi:arrow-left" style="color:${gridColor}; opacity:${gridOpacity};"></ha-icon>
          ${renderValue(gridExportFormatted)}
        </span>
      `;
    }

    const inferredHomeUnit =
      pvUnitRaw || gridUnitRaw || batteryUnitRaw || homeUnitOverride || "W";
    const homeUnit = "W";
    const homeNumericW = this._toWatts(homeNumeric, inferredHomeUnit);
    const homeEffectiveW = this._homeEffective || 0;
    const homeEffectiveRender = homeEffectiveW;
    const homeThresholdDisplay = this._toWatts(this._parseThreshold(homeCfg.threshold), "W", true);
    const forceRawHome =
      homeCfg.force_raw_state ||
      homeCfg.force_raw ||
      homeCfg.raw_state ||
      this._config?.home_force_raw;
    let homeVal = Number.isFinite(homeNumericW)
      ? this._formatPowerWithOverride(homeNumericW, homeDecimals, homeUnit, homeUnitOverride ?? null)
      : this._formatEntity(homeCfg.entity, homeDecimals, null, homeUnitOverride);
    if (!forceRawHome && this._homeEffective != null) {
      const effectiveDisplay = homeEffectiveW;
      homeVal = this._formatPowerWithOverride(effectiveDisplay, homeDecimals, homeUnit, homeUnitOverride ?? null);
    }

    const pvColor = this._getColor("pv", pvCfg);
    const gridColor = this._getColor("grid", gridCfg);
    const homeColor = this._getColor("home", homeCfg);
    const batteryColor = this._getColor("battery", batteryCfg);

    const pvOpacity = this._opacityFor(pvNumericW, pvThresholdDisplay);
    const gridOpacity = this._opacityFor(gridNumericW, gridThresholdDisplay);
    const homeValueForOpacity = homeCfg?.entity ? homeNumericW : homeEffectiveW;
    const homeOpacity = this._opacityFor(homeValueForOpacity, homeThresholdDisplay);
    const batteryOpacity = this._opacityFor(battNumericW, batteryThresholdDisplay);
    const batteryLabelOpacity = batteryOpacity;
    const pvLabelHidden = this._isBelowThreshold(pvNumericW, pvThresholdDisplay);
    const gridLabelHidden = this._isBelowThreshold(gridNumericW, gridThresholdDisplay);
    const homeLabelHidden = this._isBelowThreshold(homeValueForOpacity, homeThresholdDisplay);
    const batteryLabelHidden = this._isBelowThreshold(battNumericW, batteryThresholdDisplay);

    const labelFlickerMs = 500;
    const labelFlickerNow = Date.now();
    if (!this._labelFlickerStates) this._labelFlickerStates = new Map();
    const nextLabelStates = new Map();
    const recordLabelFlicker = (key, active) => {
      const prevState = this._labelFlickerStates.get(key) || {};
      let flickerUntil = prevState.flickerUntil || 0;
      if (prevState.active && !active) {
        flickerUntil = labelFlickerNow + labelFlickerMs;
      }
      if (active) flickerUntil = 0;
      if (flickerUntil && flickerUntil <= labelFlickerNow) {
        flickerUntil = 0;
      }
      const flicker = flickerUntil > labelFlickerNow;
      nextLabelStates.set(key, { active, flickerUntil });
      return flicker;
    };
    const pvLabelActive = Number.isFinite(pvNumericW) && Math.abs(pvNumericW) > 0 && !pvLabelHidden;
    const gridLabelActive = Number.isFinite(gridNumericW) && Math.abs(gridNumericW) > 0 && !gridLabelHidden;
    const batteryLabelActive =
      Number.isFinite(battNumericW) && Math.abs(battNumericW) > 0 && !batteryLabelHidden;
    const pvLabelFlicker = recordLabelFlicker("pv", pvLabelActive);
    const gridLabelFlicker = recordLabelFlicker("grid", gridLabelActive);
    const batteryLabelFlicker = recordLabelFlicker("battery", batteryLabelActive);

    const battDisplay = battNumericW;
    const batterySocEntries = batteryList.map((cfg) => {
      const soc = this._getBatterySocValue(cfg);
      const rawCap = cfg?.battery_capacity;
      const cap =
        rawCap == null
          ? null
          : Number.isFinite(rawCap)
          ? rawCap
          : Number.isFinite(parseFloat(rawCap))
          ? parseFloat(rawCap)
          : null;
      const capKwh = cap != null && cap > 0 ? cap : null;
      return { soc, cap: capKwh };
    });
    const socValues = batterySocEntries.map((e) => e.soc).filter((v) => Number.isFinite(v));
    const allHaveCap =
      batterySocEntries.length > 0 &&
      batterySocEntries.every((e) => Number.isFinite(e.soc) && Number.isFinite(e.cap));
    const batterySocPrimary = allHaveCap
      ? (() => {
          const totalCap = batterySocEntries.reduce((sum, e) => sum + (e.cap || 0), 0);
          if (totalCap <= 0) return null;
          const energy = batterySocEntries.reduce(
            (sum, e) => sum + (e.cap || 0) * (e.soc || 0) / 100,
            0
          );
          return (energy / totalCap) * 100;
        })()
      : socValues.length > 0
      ? socValues.reduce((sum, v) => sum + v, 0) / socValues.length
      : null;
    const batterySocDisplay = batteryShowSoc && Number.isFinite(batterySocPrimary)
      ? Math.round(batterySocPrimary)
      : null;
    const batterySocEntity = batteryShowSoc ? this._getBatterySocEntity(batteryCfg) : null;
    const batterySocClickable = Boolean(batterySocEntity) && batteryList.length <= 1;
    this._labelFlickerStates = nextLabelStates;
    let nextLabelFlickerEnd = null;
    for (const state of nextLabelStates.values()) {
      const flickerUntil = state?.flickerUntil || 0;
      if (flickerUntil > labelFlickerNow) {
        nextLabelFlickerEnd =
          nextLabelFlickerEnd == null
            ? flickerUntil
            : Math.min(nextLabelFlickerEnd, flickerUntil);
      }
    }
    if (nextLabelFlickerEnd != null) {
      const delay = Math.max(0, nextLabelFlickerEnd - labelFlickerNow + 20);
      if (this._labelFlickerTimer) clearTimeout(this._labelFlickerTimer);
      this._labelFlickerTimer = setTimeout(() => {
        this._labelFlickerTimer = null;
        this.requestUpdate();
      }, delay);
    }

    const battVal = Number.isFinite(battDisplay)
      ? this._formatPowerWithOverride(Math.abs(battDisplay), batteryDecimals, battUnit, batteryUnitOverride ?? null)
      : this._formatEntity(batteryCfg.entity, batteryDecimals, null, batteryUnitOverride);
    const battValDisplay = batterySocDisplay != null
      ? html`${renderValue(battVal)} | ${
          batterySocClickable
            ? html`<span
                class="clickable"
                @click=${(ev) => {
                  ev.stopPropagation();
                  this._openMoreInfo(batterySocEntity);
                }}
              ><span class="value-number">${batterySocDisplay}</span><span class="value-unit">%</span></span>`
            : html`<span class="value-number">${batterySocDisplay}</span><span class="value-unit">%</span>`
        }`
      : battVal;
    const battValNode = typeof battValDisplay === "string"
      ? renderValue(battValDisplay)
      : battValDisplay;
    const battArrow =
      battDisplay > 0 ? "mdi:arrow-left" : battDisplay < 0 ? "mdi:arrow-right" : null;

    const mainChargeEnt = batteryCfg?.charge_entity || batteryCfg?.chargeEntity;
    const mainDischargeEnt = batteryCfg?.discharge_entity || batteryCfg?.dischargeEntity;
    const mainHasBothDirectional = Boolean(mainChargeEnt && mainDischargeEnt);
    let dualBattValDisplay = null;
    if (mainHasBothDirectional) {
      const mainChargeUnit =
        this.hass?.states?.[mainChargeEnt]?.attributes?.unit_of_measurement || battUnit;
      const mainDischargeUnit =
        this.hass?.states?.[mainDischargeEnt]?.attributes?.unit_of_measurement || battUnit;
      const mainChargeW = this._toWatts(this._getNumeric(mainChargeEnt), mainChargeUnit);
      const mainDischargeW = this._toWatts(this._getNumeric(mainDischargeEnt), mainDischargeUnit);
      const mainChargeFormatted = this._formatPowerWithOverride(
        Math.abs(mainChargeW),
        batteryDecimals,
        battUnit,
        batteryUnitOverride ?? null
      );
      const mainDischargeFormatted = this._formatPowerWithOverride(
        Math.abs(mainDischargeW),
        batteryDecimals,
        battUnit,
        batteryUnitOverride ?? null
      );

      dualBattValDisplay = html`
        <span style="display: inline-flex; align-items: center; gap: 4px;">
          <ha-icon class="inline-icon" icon="mdi:arrow-right" style="color:${batteryColor}; opacity:1;"></ha-icon>
          ${renderValue(mainChargeFormatted)}
          <span style="margin: 0 2px; opacity: 0.5;">|</span>
          <ha-icon class="inline-icon" icon="mdi:arrow-left" style="color:${batteryColor}; opacity:1;"></ha-icon>
          ${renderValue(mainDischargeFormatted)}
          ${batterySocDisplay != null
            ? html`<span style="margin: 0 2px; opacity: 0.5;">|</span>${
                batterySocClickable
                  ? html`<span
                      class="clickable"
                      @click=${(ev) => {
                        ev.stopPropagation();
                        this._openMoreInfo(batterySocEntity);
                      }}
                    ><span class="value-number">${batterySocDisplay}</span><span class="value-unit">%</span></span>`
                  : html`<span class="value-number">${batterySocDisplay}</span><span class="value-unit">%</span>`
              }`
            : ""}
        </span>
      `;
    }

    const batteryIcon = Number.isFinite(batterySocPrimary)
      ? this._getBatteryIcon(batterySocPrimary)
      : battDisplay < 0
      ? "mdi:battery-charging"
      : "mdi:battery";
    const batteryIconId = batteryCfg?.icon || batteryIcon;
    const hasBatteryIconOverride = Boolean(batteryCfg?.icon);
    const batteryIconPath = this._getMdiPath(batteryIconId);

    const batteryIconOpacity = 1;
    const curveFactor = this._getCurveFactor();
    const curvedLines = curveFactor > 0;
    const curveScale = curvedLines ? (curveFactor - 1) / 4 : 0; // 0 at factor 1, 1 at factor 5
    const cornerBaseRadius = pvGridTurnRadius;
    const sourcePositions = [];
    const homeX = homeCenterX;
    const homeRowYBase = 145 + deviceYOffset; // base Y for aux row; actual Y will be adjusted via pctHomeY

    const deviceFlickerMs = 500;
    const deviceFlickerNow = Date.now();
    if (!this._deviceLineStates) this._deviceLineStates = new Map();
    const nextDeviceStates = new Map();
    const deviceSources = normalizedSources.map((src, idx) => {
      const entity = src.entity || null;
      const switchEntity = src.switch_entity || src.switchEntity || null;
      const attribute = src.attribute || null;
      const name = src.name || null;
      const nameEntity = name && this.hass?.states?.[name] ? name : null;
      const displayName = nameEntity ? this._formatEntityStateWithUnit(nameEntity) : name;
      const icon = src.icon || this._getEntityIcon(entity, "mdi:power-plug");
      const isPowerDevice = this._isPowerDevice(entity);
      const st = entity ? this.hass?.states?.[entity] : null;
      const raw = attribute ? st?.attributes?.[attribute] : st?.state;
      const isUnavailable = this._isUnavailableState(raw);
      const numeric = isUnavailable ? 0 : this._getNumericMaybe(entity, attribute);
      const unit = st?.attributes?.unit_of_measurement || "";
      const decimals = this._getDecimalPlaces(src);
      const numericW = isPowerDevice
        ? isUnavailable
          ? 0
          : this._toWatts(numeric, unit, true)
        : null;
      const hasPowerNumeric = isPowerDevice && (isUnavailable ? true : Number.isFinite(numericW));
      const unitOverride = this._getUnitOverride(src);
      let val = hasPowerNumeric
        ? this._formatPowerWithOverride(numericW, decimals, "W", unitOverride ?? null)
        : this._formatEntity(entity, decimals, attribute, unitOverride);
      const color = src.color || homeColor;
      const threshold = isPowerDevice
        ? this._toWatts(this._parseThreshold(src.threshold), "W", true)
        : null;
      const opacity = hasPowerNumeric ? this._opacityFor(numericW, threshold) : 1;
      const hidden =
        (hasPowerNumeric && this._isBelowThreshold(numericW, threshold)) ||
        (isPowerDevice &&
          this._coerceBoolean(src.force_hide_under_threshold, false) &&
          numericW === 0);
      const forceHideUnderThreshold = this._coerceBoolean(src.force_hide_under_threshold, false);
      let switchOn = false;
      if (isPowerDevice && switchEntity) {
        const swState = this.hass?.states?.[switchEntity]?.state;
        switchOn = String(swState || "").toLowerCase() === "on";
      }
      return {
        sourceIndex: idx,
        entity,
        switchEntity,
        switchOn,
        name: displayName,
        icon,
        val,
        color,
        opacity,
        hidden,
        numeric: hasPowerNumeric ? numericW : numeric ?? 0,
        isPowerDevice,
        threshold,
        forceHideUnderThreshold,
      };
    });

    const visibleSources = deviceSources.filter(
      (src) => !(src.forceHideUnderThreshold && src.hidden)
    );
    const maxDevices = Math.min(visibleSources.length, maxItemsByColumns);
    const deviceVisible = visibleSources.slice(0, maxDevices);

    if (maxDevices > 0) {
      // Build outward from the home icon in viewBox coords; spacing is driven by column count.
      const deviceWidth = baseWidth;
      const pad = Math.max(16, deviceWidth * 0.05);
      const columnWidth = columnCount > 0 ? deviceWidth / columnCount : deviceWidth / 12;
      const spacingBase = Math.max(
        columnWidth * 1.5, // 1.5 columns per device slot
        56 * (deviceWidth / designWidth) // keep a sensible minimum spacing on small widths
      );
      const deviceRings = Math.max(1, Math.ceil(maxDevices / 2));
      const maxSpacing = (deviceWidth / 2 - pad) / deviceRings;
      const spacing = Math.max(0, Math.min(spacingBase, maxSpacing));

      for (let ring = 1; sourcePositions.length < maxDevices; ring++) {
        const leftX = homeX - spacing * ring;
        const rightX = homeX + spacing * ring;
        const clampedLeft = Math.max(pad, Math.min(deviceWidth - pad, leftX));
        const clampedRight = Math.max(pad, Math.min(deviceWidth - pad, rightX));
        sourcePositions.push({
          x: clampedLeft,
          y: homeRowYBase,
          leftPct: (clampedLeft / deviceWidth) * 100,
        });
        if (sourcePositions.length < maxDevices) {
          sourcePositions.push({
            x: clampedRight,
            y: homeRowYBase,
            leftPct: (clampedRight / deviceWidth) * 100,
          });
        }
        if (ring >= deviceRings) break;
      }
    }

    const sources = deviceVisible.map((src, idx) => {
      const pos = sourcePositions[idx] || { x: homeX, y: homeRowYBase };
      const key = src.entity || `idx-${src.sourceIndex}`;
      let active = false;
      let flicker = false;
      let flickerUntil = 0;
      if (src.isPowerDevice) {
        if (src.switchEntity) {
          active = src.switchOn;
        } else {
          active = src.numeric > 0 && !src.hidden;
        }
        const prevState = this._deviceLineStates.get(key) || {};
        flickerUntil = prevState.flickerUntil || 0;
        if (prevState.active && !active) {
          flickerUntil = deviceFlickerNow + deviceFlickerMs;
        }
        if (active) flickerUntil = 0;
        if (flickerUntil && flickerUntil <= deviceFlickerNow) {
          flickerUntil = 0;
        }
        flicker = flickerUntil > deviceFlickerNow;
        nextDeviceStates.set(key, { active, flickerUntil });
      }
      const leftPct = pos.leftPct != null ? pos.leftPct : (pos.x / baseWidth) * 100;
      const topPctVal = pctHomeY(pos.y);
      return {
        ...src,
        key,
        pos,
        leftPct,
        topPct: topPctVal,
        active,
        flicker,
      };
    });
    const hasDeviceSources = sources.length > 0;
    const deviceUsageWatts = sources.reduce((total, src) => {
      if (!src?.isPowerDevice) return total;
      const val = src?.hidden ? 0 : Math.max(src?.numeric ?? 0, 0);
      return total + val;
    }, 0);
    const deviceUsageActive = deviceUsageWatts > 0;
    const pulseMinSeconds = 0.6;
    const pulseMaxSeconds = 2.2;
    const pulseMaxWatts = 5000;
    const pulseT = Math.min(deviceUsageWatts, pulseMaxWatts) / pulseMaxWatts;
    const devicePulseSeconds = pulseMaxSeconds - (pulseMaxSeconds - pulseMinSeconds) * pulseT;
    const deviceJunctionTopPct = pctHomeY(homeRowYBase + 26);
    let deviceLines = [];
    if (enableDevicePowerLines) {
      deviceLines = sourcePositions.map((pos, idx) => {
        const src = sources[idx];
        if (!src?.isPowerDevice) return null;
        if (!src) return null;
        const active = Boolean(src.active);
        const startX = pos.x;
        const startY = syHome(homeRowYBase + 22); // start just below label, anchored to bottom
        const downY = startY + 8;
        const upY = startY + 4;
        const color = homeColor;
        const dashed = !active;
        const opacity = dashed ? 0.1 : 1;
        return {
          key: src.key || src.entity || `idx-${idx}`,
          active,
          color,
          opacity,
          idx,
          startX,
          startY,
          downY,
          upY,
          homeX: homeNode.x,
          dashed,
        };
      }).filter(Boolean);
    }
    this._deviceLines = deviceLines;
    this._deviceLineStates = nextDeviceStates;

    const pvLabelPositions = [];
    const pvLabelPad = Math.max(16, baseWidth * 0.05);
    const pvColumnWidth = columnCount > 0 ? baseWidth / columnCount : baseWidth / 12;
    const pvLabelSpacingBase = Math.max(
      pvColumnWidth * 1.5,
      56 * (baseWidth / designWidth)
    );
    const pvLabelCap = Math.max(4, maxItemsByColumns);
    const pvLabelY = 28;

    const gridIconTop = gridNodeY + 9;
    const batteryIconTop = gridNodeY + 9;
    const gridLabelCount = Math.min(gridLabels.length, gridLabelMax);
    const gridLabelPositions = Array.from({ length: gridLabelCount }, (_, idx) => ({
      xPct: ((gridIconX + 6) / baseWidth) * 100,
      yPx: gridNodeY - 30 - (18 * idx),
    }));
    const gridLabelItems = gridLabels.slice(0, gridLabelCount).map((lbl, idx) => {
      const entity = lbl.entity || null;
      const attribute = lbl.attribute || null;
      const name = lbl.name || null;
      const unitOverride = this._getUnitOverride(lbl);
      const icon = lbl.icon || this._getLabelIcon(entity, attribute, "mdi:tag-text-outline");
      const color = lbl.color || gridColor;
      const st = entity ? this.hass?.states?.[entity] : null;
      const raw = attribute ? st?.attributes?.[attribute] : st?.state;
      const isUnavailable = this._isUnavailableState(raw);
      const isPowerEntity = this._isPowerDevice(entity);
      const numeric = isUnavailable ? 0 : this._getNumericMaybe(entity, attribute);
      const decimals = this._getDecimalPlaces(lbl);
      const labelUnit =
        unitOverride ||
        this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
        "";
      const numericW = isUnavailable ? 0 : this._toWatts(numeric, labelUnit, true);
      const hasNumeric = isUnavailable
        ? true
        : Number.isFinite(isPowerEntity ? numericW : numeric);
      const val = isUnavailable
        ? "0"
        : hasNumeric
        ? isPowerEntity
          ? this._formatPowerWithOverride(numericW, decimals, "W", unitOverride ?? null)
          : this._formatEntity(entity, decimals, attribute, unitOverride)
        : this._formatEntity(entity, decimals, attribute, unitOverride);
      const threshold = this._toWatts(this._parseThreshold(lbl.threshold), "W", true);
      const opacity =
        isPowerEntity && hasNumeric
          ? (numericW === 0 ? 1 : this._opacityFor(numericW, threshold))
          : 1;
      const hidden =
        isPowerEntity && hasNumeric ? this._isBelowThreshold(numericW, threshold) : false;
      const pos = gridLabelPositions[idx] || gridLabelPositions[gridLabelPositions.length - 1];
      return {
        entity,
        name,
        icon,
        color,
        val,
        opacity,
        hidden,
        xPct: pos.xPct,
        yPx: pos.yPx,
        numeric: hasNumeric ? (isPowerEntity ? numericW : numeric) : 0,
      };
    });

    const batteryLabelSource = (!hasBattery && pvInBatterySlot && pvLabels.length)
      ? pvLabels
      : batteryLabels;
    const batteryLabelDefaultColor = (!hasBattery && pvInBatterySlot && pvLabels.length)
      ? pvColor
      : batteryColor;
    const batteryLabelCount = Math.min(batteryLabelSource.length, batteryLabelMax);
    const batteryLabelPositions = Array.from({ length: batteryLabelCount }, (_, idx) => ({
      xPct: ((batteryIconX - 5) / baseWidth) * 100,
      yPx: gridNodeY - 30 - (18 * idx),
    }));
    const batteryLabelItems = batteryLabelSource.slice(0, batteryLabelCount).map((lbl, idx) => {
      const entity = lbl.entity || null;
      const attribute = lbl.attribute || null;
      const name = lbl.name || null;
      const unitOverride = this._getUnitOverride(lbl);
      const icon = lbl.icon || this._getLabelIcon(entity, attribute, "mdi:tag-text-outline");
      const color = lbl.color || batteryLabelDefaultColor;
      const st = entity ? this.hass?.states?.[entity] : null;
      const raw = attribute ? st?.attributes?.[attribute] : st?.state;
      const isUnavailable = this._isUnavailableState(raw);
      const isPowerEntity = this._isPowerDevice(entity);
      const numeric = isUnavailable ? 0 : this._getNumericMaybe(entity, attribute);
      const decimals = this._getDecimalPlaces(lbl);
      const labelUnit =
        unitOverride ||
        this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
        "";
      const numericW = isUnavailable ? 0 : this._toWatts(numeric, labelUnit, true);
      const hasNumeric = isUnavailable
        ? true
        : Number.isFinite(isPowerEntity ? numericW : numeric);
      const val = isUnavailable
        ? "0"
        : hasNumeric
        ? isPowerEntity
          ? this._formatPowerWithOverride(numericW, decimals, "W", unitOverride ?? null)
          : this._formatEntity(entity, decimals, attribute, unitOverride)
        : this._formatEntity(entity, decimals, attribute, unitOverride);
      const threshold = this._toWatts(this._parseThreshold(lbl.threshold), "W", true);
      const opacity =
        isPowerEntity && hasNumeric ? this._opacityFor(numericW, threshold) : 1;
      const hidden =
        isPowerEntity && hasNumeric ? this._isBelowThreshold(numericW, threshold) : false;
      const pos = batteryLabelPositions[idx] || batteryLabelPositions[batteryLabelPositions.length - 1];
      return {
        entity,
        name,
        icon,
        color,
        val,
        opacity,
        hidden,
        xPct: pos.xPct,
        yPx: pos.yPx,
        numeric: hasNumeric ? (isPowerEntity ? numericW : numeric) : 0,
      };
    });

    // Sync host classes for hiding sections
    const hasPvLabels = pvLabels.length > 0;
    const hasGridLabels = gridLabelCount > 0;
    const hasBatteryLabels = batteryLabelCount > 0;
    const sideLabelCount = Math.max(gridLabelCount, batteryLabelCount);
    const hasSingleSideLabel = sideLabelCount === 1;
    this.classList.toggle("no-pv", !hasPv);
    this.classList.toggle("no-battery", !hasBattery);
    this.classList.toggle("pv-as-battery", pvInBatterySlot);
    this.classList.toggle("has-pv-labels", hasPvLabels);
    this.classList.toggle("has-grid-labels", hasGridLabels);
    this.classList.toggle("has-battery-labels", hasBatteryLabels);
    this.classList.toggle("has-single-side-label", hasSingleSideLabel);

    const allowExtraPvLabels =
      (rowCount === 3 && gridLabels.length <= 1 && batteryLabelSource.length <= 1) ||
      (rowCount === 4 && (gridLabels.length <= 2 || batteryLabelSource.length <= 2));
    const pvLabelLimit = rowCount >= 5 || allowExtraPvLabels ? pvLabelCap : 4;
    const pvLabelCount = Math.min(pvLabels.length, pvLabelLimit);
    const pvRings = Math.max(1, Math.ceil(pvLabelCount / 2));
    const pvMaxSpacing = (baseWidth / 2 - pvLabelPad) / pvRings;
    const pvLabelSpacing = Math.max(0, Math.min(pvLabelSpacingBase, pvMaxSpacing));
    for (let ring = 1; pvLabelPositions.length < pvLabelCount; ring++) {
      const leftX = pvCenterX - pvLabelSpacing * ring;
      const rightX = pvCenterX + pvLabelSpacing * ring;
      pvLabelPositions.push({ x: leftX });
      if (pvLabelPositions.length < pvLabelCount) {
        pvLabelPositions.push({ x: rightX });
      }
      if (ring >= pvRings) break;
    }
    const pvLabelMax = Math.min(pvLabels.length, pvLabelPositions.length);
    const pvLabelItems = (!hasBattery && pvInBatterySlot)
      ? []
      : pvLabels.slice(0, pvLabelMax).map((lbl, idx) => {
        const entity = lbl.entity || null;
        const attribute = lbl.attribute || null;
        const name = lbl.name || null;
        const unitOverride = this._getUnitOverride(lbl);
        const icon = lbl.icon || this._getLabelIcon(entity, attribute, "mdi:tag-text-outline");
        const color = lbl.color || pvColor;
        const st = entity ? this.hass?.states?.[entity] : null;
        const raw = attribute ? st?.attributes?.[attribute] : st?.state;
        const isUnavailable = this._isUnavailableState(raw);
        const isPowerEntity = this._isPowerDevice(entity);
        const numeric = isUnavailable ? 0 : this._getNumericMaybe(entity, attribute);
        const decimals = this._getDecimalPlaces(lbl);
        const labelUnit =
          unitOverride ||
          this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
          "";
        const numericW = isUnavailable ? 0 : this._toWatts(numeric, labelUnit, true);
        const hasNumeric = isUnavailable
          ? true
          : Number.isFinite(isPowerEntity ? numericW : numeric);
        const val = isUnavailable
          ? "0"
          : hasNumeric
          ? isPowerEntity
            ? this._formatPowerWithOverride(numericW, decimals, "W", unitOverride ?? null)
            : this._formatEntity(entity, decimals, attribute, unitOverride)
          : this._formatEntity(entity, decimals, attribute, unitOverride);
        const threshold = this._toWatts(this._parseThreshold(lbl.threshold), "W", true);
        const opacity =
          isPowerEntity && hasNumeric
            ? (numericW === 0 ? 1 : this._opacityFor(numericW, threshold))
            : 1;
        const hidden =
          isPowerEntity && hasNumeric ? this._isBelowThreshold(numericW, threshold) : false;
        const posMeta = pvLabelPositions[idx] || pvLabelPositions[pvLabelPositions.length - 1];
        const leftPct = (posMeta.x / baseWidth) * 100;
        const yPct = pctBaseY(pvLabelY); // PV stays fixed in Y
        return {
          entity,
          name,
          icon,
          color,
          val,
          opacity,
          hidden,
          leftPct,
          topPct: yPct,
          numeric: hasNumeric ? (isPowerEntity ? numericW : numeric) : 0,
        };
      });

    const batteryDetails =
      batteryList.length > 1
        ? batteryComputed
            .map((item) => {
              const cfg = item.cfg || {};
              const entity = cfg.entity || cfg.charge_entity || cfg.discharge_entity || cfg.chargeEntity || cfg.dischargeEntity || null;
              if (!entity) return null;
              const unitOverride = this._getUnitOverride(cfg);
              const decimals = this._getDecimalPlaces(cfg);
              const showSoc = Boolean(cfg?.show_soc);
              const soc = showSoc ? this._getBatterySocValue(cfg) : null;
              const socEntity = showSoc ? this._getBatterySocEntity(cfg) : null;
              const icon = Number.isFinite(soc)
                ? this._getBatteryIcon(soc)
                : cfg.icon || this._getLabelIcon(entity, null, "mdi:battery");
              const color = cfg.color || batteryColor;
              const numericW = item.raw; // raw value (watts) for direction/opacity
              const stateUnit =
                item.unit ||
                this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
                "";
              const wattsForDisplay = Number.isFinite(item.raw)
                ? item.raw
                : this._toWatts(this._getNumeric(entity), stateUnit);
              const effectiveW = item.effective; // thresholded value for aggregation
              const threshold = item.threshold;
              const opacity = this._opacityFor(numericW, threshold);
              const hidden = this._isBelowThreshold(numericW, threshold);

              const bChargeEnt = cfg.charge_entity || cfg.chargeEntity;
              const bDischargeEnt = cfg.discharge_entity || cfg.dischargeEntity;
              const bHasBoth = Boolean(bChargeEnt && bDischargeEnt);
              let bValNode = null;
              if (bHasBoth) {
                const bChargeUnit =
                  this.hass?.states?.[bChargeEnt]?.attributes?.unit_of_measurement || "W";
                const bDischargeUnit =
                  this.hass?.states?.[bDischargeEnt]?.attributes?.unit_of_measurement || "W";
                const bChargeW = this._toWatts(this._getNumeric(bChargeEnt), bChargeUnit);
                const bDischargeW = this._toWatts(this._getNumeric(bDischargeEnt), bDischargeUnit);
                const bChargeFormatted = this._formatPowerWithOverride(
                  Math.abs(bChargeW),
                  decimals,
                  "W",
                  unitOverride ?? null
                );
                const bDischargeFormatted = this._formatPowerWithOverride(
                  Math.abs(bDischargeW),
                  decimals,
                  "W",
                  unitOverride ?? null
                );

                bValNode = html`
                  <span style="display: inline-flex; align-items: center; gap: 2px;">
                    <ha-icon class="inline-icon" icon="mdi:arrow-right" style="color:${color}; opacity:1; --mdc-icon-size: calc(12px * var(--cpc-scale, 1));"></ha-icon>
                    ${renderValue(bChargeFormatted)}
                    <span style="margin: 0 1px; opacity: 0.5;">|</span>
                    <ha-icon class="inline-icon" icon="mdi:arrow-left" style="color:${color}; opacity:1; --mdc-icon-size: calc(12px * var(--cpc-scale, 1));"></ha-icon>
                    ${renderValue(bDischargeFormatted)}
                    ${Number.isFinite(soc)
                      ? html`<span style="margin: 0 1px; opacity: 0.5;">|</span>${
                          socEntity
                            ? html`<span
                                class="clickable"
                                @click=${(ev) => {
                                  ev.stopPropagation();
                                  this._openMoreInfo(socEntity);
                                }}
                              ><span class="value-number">${Math.round(soc)}</span><span class="value-unit">%</span></span>`
                            : html`<span class="value-number">${Math.round(soc)}</span><span class="value-unit">%</span>`
                        }`
                      : ""}
                  </span>
                `;
              }

              const displayVal = Number.isFinite(wattsForDisplay)
                ? this._formatPowerWithOverride(
                    Math.abs(wattsForDisplay),
                    decimals,
                    "W",
                    unitOverride ?? null
                  )
                : entity
                ? this._formatEntity(entity, decimals, null, unitOverride)
                : "";
              const displayText = Number.isFinite(soc)
                ? `${displayVal} | ${Math.round(soc)}%`
                : displayVal;
              const displayValBold = Number.isFinite(soc)
                ? html`${renderValue(displayVal)} | ${
                    socEntity
                      ? html`<span
                          class="clickable"
                          @click=${(ev) => {
                            ev.stopPropagation();
                            this._openMoreInfo(socEntity);
                          }}
                        ><span class="value-number">${Math.round(soc)}</span><span class="value-unit">%</span></span>`
                      : html`<span class="value-number">${Math.round(soc)}</span><span class="value-unit">%</span>`
                  }`
                : renderValue(displayVal);
              const arrow =
                numericW > 0 ? "mdi:arrow-left" : numericW < 0 ? "mdi:arrow-right" : null;
              return {
                cfg,
                entity,
                icon,
                color,
                val: displayText,
                hasBoth: bHasBoth,
                valNode: bValNode || displayValBold,
                opacity,
                arrow,
                hidden,
              };
            })
            .filter(Boolean)
        : [];
    const batteryDetailsLeft = (batteryIconX / baseWidth) * 100;
    const batteryListAnchor = gridNodeY - 18; // align list a bit above node
    const batteryDetailsOffsetPx = 44; // vertical gap from the icon/label to the multi list
    const batteryDetailsTopPx = batteryListAnchor + batteryDetailsOffsetPx;


    const makeCornerPath = (startX, startY, endX, endY, sweepFlag, firstAxis = "H") => {
      if (!curvedLines) return firstAxis === "H"
        ? `M${startX} ${startY} H${endX} V${endY}`
        : `M${startX} ${startY} V${endY} H${endX}`;

      const spanX = Math.abs(endX - startX);
      const spanY = Math.abs(endY - startY);
      const cornerX = firstAxis === "H" ? endX : startX;
      const cornerY = firstAxis === "H" ? startY : endY;

      if (curveFactor >= 5) {
        // Single smooth curve from start to end via the corner.
        return `M${startX} ${startY} Q${cornerX} ${cornerY} ${endX} ${endY}`;
      }

      const maxInset = Math.min(spanX, spanY); // so inset never exceeds the shorter leg
      const inset = cornerBaseRadius + (maxInset - cornerBaseRadius) * curveScale;
      const r = inset;

      if (firstAxis === "H") {
        const horizEnd = endX > startX ? endX - inset : endX + inset;
        const arcEndY = endY > startY ? startY + inset : startY - inset;
        const sweep = sweepFlag; // 0 or 1
        return `M${startX} ${startY} H${horizEnd} A${r} ${r} 0 0 ${sweep} ${endX} ${arcEndY} V${endY}`;
      } else {
        const vertEnd = endY > startY ? endY - inset : endY + inset;
        const arcEndX = endX > startX ? startX + inset : startX - inset;
        const sweep = sweepFlag;
        return `M${startX} ${startY} V${vertEnd} A${r} ${r} 0 0 ${sweep} ${arcEndX} ${endY} H${endX}`;
      }
    };

    const pvGridPath = makeCornerPath(gridLineStartX, gridPvStartY, pvGridEndX, pvNode.y, 0, "H");
    const pvBatteryPath = makeCornerPath(pvBatteryStartX, pvNode.y, batteryNode.x, pvBatteryEndY, 0, "V");
    const gridHomePath = makeCornerPath(gridNode.x, gridHomeStartY, gridHomeEndX, homeNode.y, 1, "H");
    const batteryHomePath = makeCornerPath(batteryNode.x, batteryHomeStartY, batteryHomeEndX, homeNode.y, 0, "H");
    const gridBatteryPath = curvedLines
      ? `M${gridNode.x} ${gridNode.y} H${humpStartX} Q${humpCtrlInX} ${humpPeakY} ${homeCenterX} ${humpPeakY} Q${humpCtrlOutX} ${humpPeakY} ${humpEndX} ${gridNode.y} H${batteryNode.x}`
      : `M${gridNode.x} ${gridNode.y} H${batteryNode.x}`;

    const layoutReady = this._layoutReady;
    const hideCardBackground = this._coerceBoolean(this._config?.hide_card_background, false);

    return html`
      <ha-card class="${[
        hasPv ? "" : "no-pv",
        hasBattery ? "" : "no-battery",
        pvInBatterySlot ? "pv-as-battery" : "",
        hasPvLabels ? "has-pv-labels" : "",
        hasGridLabels ? "has-grid-labels" : "",
        hasBatteryLabels ? "has-battery-labels" : "",
        hasSingleSideLabel ? "has-single-side-label" : "",
        hideCardBackground ? "transparent" : "",
        layoutReady ? "layout-ready" : "",
      ]
        .filter(Boolean)
        .join(" ")}">
        <div class="canvas">
          <svg viewBox="0 0 ${baseWidth} ${viewHeight}" preserveAspectRatio="xMidYMid meet">

          <!-- Flow lines, updated endpoints (straight lines) -->
          <path id="line-pv-grid" class="flow-line" fill="none" d="${pvGridPath}" />
          <line id="line-pv-home" class="flow-line"
                x1="${pvNode.x}" y1="${pvNode.y}" x2="${homeNode.x}" y2="${homeNode.y}" />
          <path id="line-pv-battery" class="flow-line" fill="none" d="${pvBatteryPath}" />
          <path id="line-grid-home" class="flow-line" fill="none" d="${gridHomePath}" />
          <path id="line-home-battery" class="flow-line" fill="none" d="${batteryHomePath}" />
          <circle id="dot-pv-home"      r="4" fill="${pvColor}" opacity="0" />
          <path id="arc-grid-battery" class="flow-line" fill="none" d="${gridBatteryPath}" />
          <g id="device-lines"></g>

          <!-- Remaining flow dots -->
          <circle id="dot-pv-grid"      r="4" fill="${pvColor}" opacity="0" />
          <circle id="dot-pv-battery"   r="4" fill="${pvColor}" opacity="0" />
          <circle id="dot-grid-home"    r="4" fill="${gridColor}" opacity="0" />
          <circle id="dot-grid-battery" r="4" fill="${gridColor}" opacity="0" />
          <circle id="dot-battery-home" r="4" fill="${pvInBatterySlot ? pvColor : batteryColor}" opacity="0" />
          <circle id="dot-battery-grid" r="4" fill="${pvInBatterySlot ? pvColor : batteryColor}" opacity="0" />

          </svg>
          <div class="overlay">
            <!-- grid voltage label removed -->
            ${pvLabelItems.map(
              (lbl) => html`<div class="overlay-item" style="left:${lbl.leftPct}%; top:${lbl.topPct}%;">
                <div class="aux-marker pv-label-marker clickable" @click=${() => this._openMoreInfo(lbl.entity || null)}>
                <ha-icon icon="${lbl.icon}" style="gap: 0px; color:${lbl.color}; opacity:1; --mdc-icon-size: calc(18px * var(--cpc-scale, 1)); filter:${allowGlow && lbl.numeric !== 0 ? `drop-shadow(0 0 8px ${lbl.color})` : "none"};"></ha-icon>
                  <div class="aux-label" style="margin-top: -6px; padding-bottom: 0px; color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${renderValue(lbl.val)}</div>
                  ${lbl.name
                    ? html`<div class="aux-sub-label" style="color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${lbl.name}</div>`
                    : ""}
                </div>
              </div>`
            )}
            ${gridLabelItems.map(
              (lbl) => html`<div class="overlay-item anchor-left" style="left:${lbl.xPct}%; top:${lbl.yPx}px;">
                <div class="aux-marker clickable" style="flex-direction: row; gap: 4px;" @click=${() => this._openMoreInfo(lbl.entity || null)}>
                  <ha-icon icon="${lbl.icon}" style="color:${lbl.color}; opacity:1; --mdc-icon-size: calc(16px * var(--cpc-scale, 1)); filter:${allowGlow && lbl.numeric !== 0 ? `drop-shadow(0 0 8px ${lbl.color})` : "none"};"></ha-icon>
                  <div style="display: flex; flex-direction: column;">
                    <div class="aux-label" style="color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${renderValue(lbl.val)}</div>
                    ${lbl.name ? html`<div class="aux-sub-label" style="color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${lbl.name}</div>` : ""}
                  </div>
                </div>
              </div>`
            )}
            ${(hasBattery || (pvInBatterySlot && pvLabels.length))
              ? batteryLabelItems.map(
                  (lbl) => html`<div class="overlay-item anchor-right battery-label" style="margin-right: 10px; left:${lbl.xPct}%; top:${lbl.yPx}px;">
                    <div class="aux-marker clickable" style="flex-direction: row; gap: 4px;" @click=${() => this._openMoreInfo(lbl.entity || null)}>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div class="aux-label" style="color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${renderValue(lbl.val)}</div>
                        ${lbl.name ? html`<div class="aux-sub-label" style="color:${lbl.color}; opacity:${lbl.hidden ? 0.35 : lbl.opacity};">${lbl.name}</div>` : ""}
                      </div>
                      <ha-icon icon="${lbl.icon}" style="color:${lbl.color}; opacity:1; --mdc-icon-size: calc(16px * var(--cpc-scale, 1)); filter:${allowGlow && lbl.numeric !== 0 ? `drop-shadow(0 0 8px ${lbl.color})` : "none"};"></ha-icon>
                    </div>
                  </div>`
                )
              : ""}
            ${!pvInBatterySlot
              ? html`<div class="overlay-item pv-section pv-section-top" style="left:${(sx(256)/baseWidth)*100}%; top:${pctBaseY(24)}%;">
                  <div class="node-marker pv-marker clickable" @click=${() => this._handleTapAction(pvCfg, pvCfg.entity)}>
                    ${pvInBatterySlot
                      ? ""
                      : html`<div
                          class="node-label ${pvLabelFlicker ? "label-flicker" : ""}"
                          style="color:${pvColor}; --label-opacity:${pvLabelHidden ? 0.35 : pvOpacity}; opacity: var(--label-opacity);"
                        >
                          <span>${renderValue(pvVal)}</span>
                        </div>`}
                    ${hasPvIconOverride && pvIconPath
                      ? html`<div class="pv-icon-wrap custom" style="--cpc-pv-icon-stroke:${pvColor}; opacity:${pvInBatterySlot ? 0.5 : 1}; filter:${allowGlow && pvNumeric !== 0 ? `drop-shadow(0 0 10px ${pvColor})` : "none"};">
                          <div class="pv-icon-circle"></div>
                          <svg class="pv-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path fill="${pvColor}" d="${pvIconPath}"></path>
                          </svg>
                        </div>`
                      : html`<ha-icon icon="${pvIconId}" style="color:${pvColor}; opacity:${pvInBatterySlot ? 0.5 : 1}; filter:${allowGlow && pvNumeric !== 0 ? `drop-shadow(0 0 10px ${pvColor})` : "none"};"></ha-icon>`}
                  </div>
                </div>`
              : ""}
            ${pvInBatterySlot
              ? html`<div class="overlay-item anchor-right pv-section pv-section-battery" style="left:${((batteryIconX + 6)/baseWidth)*100}%; top:${batteryIconTop + 3}px;">
                  <div class="node-marker pv-marker right clickable" @click=${() => this._handleTapAction(pvCfg, pvCfg.entity)}>
                    ${hasPvIconOverride && pvIconPath
                      ? html`<div class="pv-icon-wrap custom" style="--cpc-pv-icon-stroke:${pvColor}; opacity:1; filter:${allowGlow && pvNumeric !== 0 ? `drop-shadow(0 0 10px ${pvColor})` : "none"};">
                          <div class="pv-icon-circle"></div>
                          <svg class="pv-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path fill="${pvColor}" d="${pvIconPath}"></path>
                          </svg>
                        </div>`
                      : html`<ha-icon icon="${pvIconId}" style="color:${pvColor}; opacity:1; filter:${allowGlow && pvNumeric !== 0 ? `drop-shadow(0 0 10px ${pvColor})` : "none"};"></ha-icon>`}
                    <div
                      class="node-label right ${pvLabelFlicker ? "label-flicker" : ""}"
                      style="color:${pvColor}; --label-opacity:${pvLabelHidden ? 0.35 : pvOpacity}; opacity: var(--label-opacity);"
                    >
                      <span>${renderValue(pvVal)}</span>
                    </div>
                  </div>
                </div>`
              : ""}
            <div class="overlay-item anchor-left" style="left:${(gridIconX/baseWidth)*100}%; top:${gridIconTop}px;">
              <div class="node-marker grid-marker left clickable" @click=${() => this._handleTapAction(gridCfg, gridCfg.entity)}>
                ${hasGridIconOverride && gridIconPath
                  ? html`<div class="grid-icon-wrap custom" style="--cpc-grid-icon-stroke:${gridColor}; filter:${allowGlow && gridNumeric !== 0 ? `drop-shadow(0 0 10px ${gridColor})` : "none"};">
                      <div class="grid-icon-circle"></div>
                      <svg class="grid-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path fill="${gridColor}" d="${gridIconPath}"></path>
                      </svg>
                    </div>`
                  : html`<ha-icon icon="${gridIconId}" style="color:${gridColor}; opacity:1; filter:${allowGlow && gridNumeric !== 0 ? `drop-shadow(0 0 10px ${gridColor})` : "none"};"></ha-icon>`}
                <div
                  class="node-label left ${gridLabelFlicker ? "label-flicker" : ""}"
                  style="color:${gridColor}; --label-opacity:${gridLabelHidden ? 0.35 : gridOpacity}; opacity: var(--label-opacity);"
                >
                  ${gridHasBothDirectional
                    ? gridValDisplay
                    : html`
                        ${gridArrow && !gridLabelHidden
                          ? html`<ha-icon class="inline-icon" icon="${gridArrow}" style="color:${gridColor}; opacity:${gridOpacity};"></ha-icon>`
                          : ""}
                        <span style="opacity:${gridOpacity};">${renderValue(gridVal)}</span>
                      `}
                </div>
              </div>
            </div>
            <div class="overlay-item" style="left:${(homeCenterX/baseWidth)*100}%; top:${pctHomeY(135)}%;">
              <div
                class="home-marker ${homeClickable ? "clickable" : ""}"
                @click=${() => {
                  if (homeClickable) this._handleTapAction(homeCfg, homeCfg.entity);
                }}
              >
                <div class="home-icon-wrap ${hasHomeIconOverride ? "custom" : ""}">
                  ${hasHomeIconOverride ? html`<div class="home-icon-circle"></div>` : ""}
                  <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="overflow: visible;">
                    <defs>
                      <linearGradient id="home-gradient" gradientUnits="userSpaceOnUse" x1="7" y1="7" x2="19" y2="20">
                        <stop id="home-stop-1" offset="0%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                        <stop id="home-stop-2" offset="100%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                        <stop id="home-stop-3" offset="100%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                        <stop id="home-stop-4" offset="100%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                        <stop id="home-stop-5" offset="100%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                        <stop id="home-stop-6" offset="100%" stop-color="${homeColor}" style="transition: stop-color 1s ease;"></stop>
                      </linearGradient>
                      <filter id="home-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" />
                      </filter>
                    </defs>
                    <title>home</title>
                    <path
                      fill="none"
                      stroke="${this._config?.disable_home_gradient ? homeColor : "url(#home-gradient)"}"
                      stroke-width="5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      opacity="${homeGlowOpacity}"
                      filter="${allowGlow ? "url(#home-glow-blur)" : "none"}"
                      d="${homeIconPath}"
                    ></path>
                    <path fill="${this._config?.disable_home_gradient ? homeColor : "url(#home-gradient)"}" d="${homeIconPath}"></path>
                  </svg>
                </div>
                <div class="home-label" style="color:${homeColor}; opacity:${homeLabelHidden ? 0.35 : homeOpacity}; ${hasHomeIconOverride ? "margin-top: calc(-8px * var(--cpc-scale, 0.8));" : ""}">${renderValue(homeVal)}</div>
              </div>
            </div>
            ${enableDevicePowerLines && hasDeviceSources && deviceUsageActive
              ? html`<div class="overlay-item device-power-dot-wrapper" style="left:${(homeCenterX/baseWidth)*100}\%; top: calc(${deviceJunctionTopPct}% + 4px);">
                  <div class="device-power-dot ${deviceUsageActive ? "active" : ""}" style="color:${homeColor};${deviceUsageActive ? `animation-duration:${devicePulseSeconds.toFixed(2)}s;` : ""}"></div>
                </div>`
              : ""}
            ${hasBattery
              ? html`<div class="overlay-item anchor-right battery-section" style="left:${(batteryIconX/baseWidth)*100}\%; top:${batteryIconTop}px;">
                  <div class="node-marker battery-marker right ${batteryDetails.length ? "" : "clickable"}" @click=${() => {                     if (!batteryDetails.length) this._handleTapAction(batteryCfg, batteryCfg.entity);                   }}>${hasBatteryIconOverride && batteryIconPath
                      ? html`<div class="battery-icon-wrap custom" style="--cpc-battery-icon-stroke:${batteryColor}; opacity:${batteryIconOpacity}; filter:${allowGlow && battNumericW !== 0 ? `drop-shadow(0 0 10px ${batteryColor})` : "none"};">
                          <div class="battery-icon-circle"></div>
                          <svg class="battery-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path fill="${batteryColor}" d="${batteryIconPath}"></path>
                          </svg>
                        </div>`
                      : html`<ha-icon icon="${batteryIconId}" style="color:${batteryColor}; opacity:${batteryIconOpacity}; filter:${allowGlow && battNumericW !== 0 ? `drop-shadow(0 0 10px ${batteryColor})` : "none"};"></ha-icon>`}
                    <div
                      class="node-label right ${batteryLabelFlicker ? "label-flicker" : ""}"
                      style="color:${batteryColor}; --label-opacity:${batteryLabelHidden ? 0.35 : batteryLabelOpacity}; opacity: var(--label-opacity);"
                    >
                      ${mainHasBothDirectional
                        ? dualBattValDisplay
                        : html`
                            ${battArrow && !batteryLabelHidden
                              ? html`<ha-icon class="inline-icon" icon="${battArrow}" style="color:${batteryColor}; opacity:1;"></ha-icon>`
                              : ""}
                            <span style="opacity:1;">${battValNode}</span>
                          `}
                    </div>
                  </div>
                </div>`
              : ""}
            <div id="icon-probe" style="display:none;"></div>
            ${batteryDetails.length
              ? html`<div class="overlay-item anchor-right-top" style="left:${batteryDetailsLeft}\%; top:${batteryDetailsTopPx}px;">
                  <div class="battery-multi" style="margin-right: 6px; margin-top: 6px;">
                    ${batteryDetails.map(
                      (b) => html`<div
                        class="battery-multi-item clickable"
                        style="margin-top: -6px; color:${b.color};"
                        @click=${() => this._handleTapAction(b.cfg, b.entity)}
                      >
                        <div class="aux-label" style="padding-top: 0px; padding-bottom: 0px; margin-top: 4px; padding-left: 1px; padding-right: 1px; opacity:${b.hidden ? 0.35 : b.opacity};">
                          ${!b.hasBoth && b.arrow && !b.hidden
                            ? html`<ha-icon class="inline-icon" icon="${b.arrow}" style="color:${b.color}; opacity:1; --mdc-icon-size: calc(12px * var(--cpc-scale, 1));"></ha-icon>`
                            : ""}
                          ${b.valNode || renderValue(b.val)}
                        </div>
                        <ha-icon icon="${b.icon}" style="color:${b.color}; opacity:1; --mdc-icon-size: calc(14px * var(--cpc-scale, 1));"></ha-icon>
                      </div>`
                    )}
                  </div>
                </div>`
              : ""}

            ${sources.map(
              (src) => html`<div class="overlay-item" style="left:${src.leftPct}\%; top:${src.topPct}%; transform: translate(-50%, -50%);">
                <div class="aux-marker">
                  ${showDeviceNames && src.name
                    ? html`<div class="device-name" style="color:${src.color};">${src.name}</div>`
                    : ""}
                  <span
                    class="device-icon-ring clickable ${src.switchEntity ? "switchable" : ""} ${src.switchOn ? "on" : ""}"
                    style="color:${src.color};"
                    @click=${() => {
                      if (src.switchEntity) {
                        this._toggleDeviceSwitch(src);
                      } else {
                        this._openMoreInfo(src.entity || null);
                      }
                    }}
                  >
                    <ha-icon
                      icon="${src.icon}"
                      style="color:${src.color}; opacity:1; filter:${allowGlow && src.numeric !== 0 ? `drop-shadow(0 0 10px ${src.color})` : "none"};"
                    ></ha-icon>
                  </span>
                  <div
                    class="aux-label clickable ${src.flicker ? "device-label-flicker" : ""}"
                    style="color:${src.color}; --device-label-opacity:${src.hidden ? 0.35 : src.opacity}; opacity: var(--device-label-opacity);"
                    @click=${() => {
                      if (src.switchEntity) {
                        this._toggleDeviceSwitch(src);
                      } else {
                        this._openMoreInfo(src.entity || null);
                      }
                    }}
                  >${renderValue(src.val)}</div>
                </div>
              </div>`
            )}
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("compact-power-card", CompactPowerCard);

// Register card metadata for the Lovelace card picker
if (window?.customCards) {
  const exists = window.customCards.some((c) => c.type === "compact-power-card");
  if (!exists) {
    window.customCards.push({
      type: "compact-power-card",
      name: "Compact Power Card",
      preview: true,
      description: "Compact power flow card with PV, grid, battery, and home flows.",
      documentationURL: "https://github.com/pacemaker82/Compact-Power-Card/blob/main/README.md",
    });
  }
} else if (window) {
  window.customCards = [
    {
      type: "compact-power-card",
      name: "Compact Power Card",
      preview: true,
      description: "Compact power flow card with PV, grid, battery, and home flows.",
      documentationURL: "https://github.com/pacemaker82/Compact-Power-Card/blob/main/README.md",
    },
  ];
}
