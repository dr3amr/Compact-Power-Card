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

      .grid-icon-wrap {
        position: relative;
        width: calc(32px * var(--cpc-scale, 1));
        height: calc(32px * var(--cpc-scale, 1));
        margin-top: 4px;
      }

      .grid-icon-circle {
        position: absolute;
        inset: 0;
        background: var(--ha-card-background, var(--card-background-color));
        border: 2px solid var(--cpc-grid-icon-stroke, #ff0000);
        border-radius: 50%;
        box-sizing: border-box;
      }

      .grid-icon {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
      }

      .grid-icon-wrap.custom .grid-icon {
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 6px;
      }

      .node-marker ha-icon {
        --mdc-icon-size: calc(32px * var(--cpc-scale, 1));
        filter: drop-shadow(0 0 0 rgba(0,0,0,0));
      }

      .node-label {
        font-size: calc(16px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
        display: flex;
        align-items: center;
        gap: 2px;
        margin-top: -4px;
      }

      .value-number {
        font-weight: 700;
      }

      .value-unit {
        font-weight: 400;
        font-size: calc(1em - 3px);
      }

      .node-label.left {
        justify-content: flex-start;
        text-align: left;
        align-self: flex-start;
      }

      .node-label.right {
        justify-content: flex-end;
        text-align: right;
        align-self: flex-end;
        width: auto;
        max-width: 100%;
      }

      .node-label ha-icon {
        --mdc-icon-size: calc(12px * var(--cpc-scale, 1));
      }

      .home-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        user-select: none;
      }

      .home-icon-wrap {
        position: relative;
        width: calc(60px * var(--cpc-scale, 1));
        height: calc(60px * var(--cpc-scale, 1));
      }

      .home-icon-circle {
        position: absolute;
        inset: 0;
        background: var(--ha-card-background, var(--card-background-color));
        border: 3px solid var(--cpc-home-winner, #ff0000);
        border-radius: 50%;
        box-sizing: border-box;
      }


      .home-icon {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
        filter: none;
      }

      .home-icon-wrap.custom .home-icon {
        width: calc(100% - 18px);
        height: calc(100% - 18px);
        margin: 9px;
      }

      .home-label {
        font-size: calc(16px * var(--cpc-scale, 0.8) * var(--cpc-text-scale, 1));
        font-weight: 700;
        margin-top: calc(-16px * var(--cpc-scale, 0.8));
      }

      .device-power-dot {
        width: calc(8px * var(--cpc-scale, 1));
        height: calc(8px * var(--cpc-scale, 1));
        border-radius: 999px;
        background: currentColor;
        opacity: 1;
      }

      .device-power-dot.active {
        animation: cpc-pulse 1.4s ease-in-out infinite;
      }

      .device-power-dot-wrapper {
        pointer-events: none;
      }

      @keyframes cpc-pulse {
        0% {
          transform: scale(0.85);
        }
        50% {
          transform: scale(1.15);
        }
        100% {
          transform: scale(0.85);
        }
      }

      .battery-multi {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0px;
      }

      .battery-multi-item {
        display: flex;
        align-items: center;
        gap: 1px;
        font-size: calc(10px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
      }

      .aux-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        user-select: none;
        position: relative;
      }

      .aux-marker ha-icon {
        --mdc-icon-size: calc(24px * var(--cpc-scale, 1));
      }

      .aux-label {
        font-size: calc(12px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
      }

      .aux-sub-label {
        font-size: calc(11px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
        font-weight: 500;
        opacity: 0.85;
        line-height: 1;
      }

      .pv-label-marker .aux-sub-label {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: -4px;
        white-space: nowrap;
      }

      .device-name {
        font-size: calc(11px * var(--cpc-scale, 1) * var(--cpc-text-scale, 1));
        opacity: 0.85;
        font-weight: 500;
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translate(-50%, calc(-100% - (4px * var(--cpc-scale, 1))));
        pointer-events: none;
        white-space: normal;
        text-align: center;
        width: calc(70px * var(--cpc-scale, 1));
        max-width: calc(70px * var(--cpc-scale, 1));
        box-sizing: border-box;
      }

      .pv-label,
      .node-label,
      .home-label,
      .aux-label,
      .aux-sub-label,
      .device-name,
      .battery-soc {
        padding: 2px 4px;
        border-radius: 4px;
        white-space: nowrap;
      }

      .device-name {
        white-space: normal;
        overflow-wrap: normal;
        word-break: normal;
        hyphens: none;
        overflow: visible;
        line-height: 0.9;
        padding-bottom: 4px;
      }

      .clickable {
        cursor: pointer;
      }

      .canvas {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .overlay-item {
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: auto;
      }

      /* Anchor helpers so labels grow away from the icon */
      .overlay-item.anchor-right {
        transform: translate(-100%, -50%);
      }

      .overlay-item.anchor-left {
        transform: translate(0, -50%);
      }

      /* Anchor top-right without vertical centering (useful for stacked lists) */
      .overlay-item.anchor-right-top {
        transform: translate(-100%, 0);
      }

      :host(.no-pv) .canvas,
      ha-card.no-pv .canvas,
      :host(.no-battery) .canvas,
      ha-card.no-battery .canvas {
        margin-top: -12px;
        margin-bottom: 0px;
      }

      :host(.no-battery) #line-pv-battery,
      :host(.no-battery) #line-home-battery,
      :host(.no-battery) #arc-grid-battery,
      :host(.no-battery) #dot-pv-battery,
      :host(.no-battery) #dot-grid-battery,
      :host(.no-battery) #dot-battery-home,
      :host(.no-battery) #dot-battery-grid,
      :host(.no-battery) .battery-section,
      :host(.no-battery) .battery-label,
      ha-card.no-battery #line-pv-battery,
      ha-card.no-battery #line-home-battery,
      ha-card.no-battery #arc-grid-battery,
      ha-card.no-battery #dot-pv-battery,
      ha-card.no-battery #dot-grid-battery,
      ha-card.no-battery #dot-battery-home,
      ha-card.no-battery #dot-battery-grid,
      ha-card.no-battery .battery-section,
      ha-card.no-battery .battery-label {
        display: none;
      }

      :host(.pv-as-battery) .battery-label,
      ha-card.pv-as-battery .battery-label {
        display: block;
      }

      :host(.pv-as-battery) #line-home-battery,
      :host(.pv-as-battery) #arc-grid-battery,
      :host(.pv-as-battery) #dot-battery-home,
      :host(.pv-as-battery) #dot-battery-grid,
      ha-card.pv-as-battery #line-home-battery,
      ha-card.pv-as-battery #arc-grid-battery,
      ha-card.pv-as-battery #dot-battery-home,
      ha-card.pv-as-battery #dot-battery-grid {
        display: inline;
      }

      :host(.pv-as-battery) #line-pv-grid,
      :host(.pv-as-battery) #line-pv-home,
      :host(.pv-as-battery) #line-pv-battery,
      :host(.pv-as-battery) #dot-pv-home,
      :host(.pv-as-battery) #dot-pv-grid,
      :host(.pv-as-battery) #dot-pv-battery,
      ha-card.pv-as-battery #line-pv-grid,
      ha-card.pv-as-battery #line-pv-home,
      ha-card.pv-as-battery #line-pv-battery,
      ha-card.pv-as-battery #dot-pv-home,
      ha-card.pv-as-battery #dot-pv-grid,
      ha-card.pv-as-battery #dot-pv-battery {
        display: none;
      }

      :host(.pv-as-battery) .pv-marker .node-label,
      ha-card.pv-as-battery .pv-marker .node-label {
        transform: translateY(-3px);
      }


      :host(.no-pv) #line-pv-grid,
      :host(.no-pv) #line-pv-home,
      :host(.no-pv) #line-pv-battery,
      :host(.no-pv) #dot-pv-home,
      :host(.no-pv) #dot-pv-grid,
      :host(.no-pv) #dot-pv-battery,
      :host(.no-pv) .pv-section,
      ha-card.no-pv #line-pv-grid,
      ha-card.no-pv #line-pv-home,
      ha-card.no-pv #line-pv-battery,
      ha-card.no-pv #dot-pv-home,
      ha-card.no-pv #dot-pv-grid,
      ha-card.no-pv #dot-pv-battery,
      ha-card.no-pv .pv-section {
        display: none;
      }
    `;
  }

  updated(changedProps) {
    if (super.updated) super.updated(changedProps);
    this._adjustLayout();
    this._renderDeviceLines();
    this._logLayoutSizes();
    const layoutKey = `${this._hostWidth ?? 0}x${this._hostHeight ?? 0}x${this._externalHeight ?? 0}`;
    if (layoutKey !== this._lastFlowLayoutKey) {
      this._lastFlowLayoutKey = layoutKey;
      this._updateFlows();
    }
    if (this._pendingFlowUpdate && this.shadowRoot) {
      this._pendingFlowUpdate = false;
      this._updateFlows();
    }
  }

  _logLayoutSizes() {
    const candidates = [
      this.shadowRoot?.querySelector("ha-card"),
      this.closest("div.card.fit-rows"),
      this.closest("div.card"),
      this.parentElement,
      this,
    ].filter(Boolean);
    let columnSize = 0;
    let rowSize = 0;
    for (const candidate of candidates) {
      const styles = getComputedStyle(candidate);
      const nextColumn = parseFloat(styles.getPropertyValue("--column-size")) || 0;
      const nextRow = parseFloat(styles.getPropertyValue("--row-size")) || 0;
      if (!columnSize && nextColumn) columnSize = nextColumn;
      if (!rowSize && nextRow) rowSize = nextRow;
      if (columnSize && rowSize) break;
    }
    this._columnSize = columnSize;
    this._rowSize = rowSize;
    if (columnSize === this._lastColumnSize && rowSize === this._lastRowSize) return;
    this._lastColumnSize = columnSize;
    this._lastRowSize = rowSize;
  }

  _shouldUseExternalHeight() {
    if (this.closest("div.card.fit-rows")) return true;
    if (this._isInCardEditor()) return false;

    const rect = this.getBoundingClientRect ? this.getBoundingClientRect() : null;
    const measuredHeight = this._getMeasuredExternalHeight(rect);
    return measuredHeight > 220;
  }

  _closestComposed(selector) {
    let node = this;
    while (node) {
      if (node instanceof Element && node.matches(selector)) return node;
      const root = node.getRootNode ? node.getRootNode() : null;
      node = node.parentNode || root?.host || null;
    }
    return null;
  }

  _isInCardEditor() {
    return Boolean(
      this._closestComposed(
        "hui-card-element-editor, hui-dialog-edit-card, hui-card-preview, hui-card-picker, ha-dialog"
      )
    );
  }

  _getMeasuredExternalHeight(rect = null) {
    const box = rect || (this.getBoundingClientRect ? this.getBoundingClientRect() : null);
    const measuredHeight = this._hostHeight || box?.height || 0;
    if (!measuredHeight) return 0;
    if (this.closest("div.card.fit-rows")) return measuredHeight;

    const viewportHeight = typeof window !== "undefined" ? window.innerHeight || 0 : 0;
    if (!viewportHeight || !box) return measuredHeight;

    const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    const documentTop = box.top + scrollY;
    const availableHeight = Math.max(0, viewportHeight - Math.max(0, documentTop));
    return availableHeight > 0 ? Math.min(measuredHeight, availableHeight) : measuredHeight;
  }

  _getLayoutMetrics({ hasPv, hasBattery, hasAnyLabels }) {
    const designWidth = 512;
    const designHeight = 184;
    const defaultWidth = 512;
    const useExternalHeight = this._shouldUseExternalHeight();
    const defaultHeight = !useExternalHeight && (!hasPv || !hasBattery) ? 150 : 184;
    const hostRect = this.getBoundingClientRect ? this.getBoundingClientRect() : null;
    const outerWidth = this._hostWidth != null ? this._hostWidth : hostRect?.width || defaultWidth;
    const measuredExternalHeight = this._getMeasuredExternalHeight(hostRect);
    let outerHeight = defaultHeight;
    if (useExternalHeight) {
      outerHeight =
        measuredExternalHeight ||
        this._externalHeight ||
        this._hostHeight ||
        hostRect?.height ||
        defaultHeight;
    }
    const padX = 8; // ha-card left+right padding (4px each)
    const padY = 2; // bottom padding; top is 0
    const baseWidth = Math.max(0, outerWidth - padX);
    const hasExternalHeight = useExternalHeight && (this._externalHeight != null || this._hostHeight != null);
    const compactTrim = 0;
    const baseHeight = hasExternalHeight
      ? Math.max(0, outerHeight - padY - compactTrim)
      : Math.max(0, outerHeight - padY - compactTrim);
    const renderScaleY = baseHeight > 0 ? (outerHeight - padY) / baseHeight : 1;
    const xScale = baseWidth / designWidth;
    const yScale = baseHeight / designHeight;
    const viewHeight = baseHeight;
    const rawRowSize = this._rowSize ?? this._lastRowSize ?? 0;
    const rowCount =
      rawRowSize > 0 && rawRowSize <= 10
        ? rawRowSize
        : Math.max(1, Math.round((outerHeight - padY) / (designHeight / 3)));
    const rawColumnSize = this._columnSize ?? this._lastColumnSize ?? 0;
    const columnCount =
      rawColumnSize > 0 && rawColumnSize <= 24
        ? rawColumnSize
        : Math.max(1, Math.round((outerWidth - padX) / (designWidth / 12)));
    let maxItemsByColumns = Math.max(1, Math.floor(columnCount / 1.5));
    if (baseWidth <= 430) {
      maxItemsByColumns = Math.min(maxItemsByColumns, 8);
    }
    const anchorLeftX = 51.2;
    const sx = (v) => v * xScale;
    const yOffset = 4;
    const syTop = (v) => v + yOffset; // keep fixed distance from top
    const sy = syTop;
    const syHome = (v) => baseHeight - (designHeight - (v + yOffset)); // keep fixed distance from bottom
    const syGridBatt = (v) => (v + yOffset) * yScale; // scale mid rows with height
    const homeCenterX = baseWidth / 2;
    const pvCenterX = homeCenterX;
    const pvNodeY = sy(52);
    const homeAnchorY = syHome(131);
    const homeLineEndY = Math.max(0, homeAnchorY - 6);
    const gridLineStartX = 35; // fixed distance from left
    const gridLineEndX = baseWidth - 35; // fixed distance from right
    const gridNodeY = syGridBatt(86);
    const gridPvStartY = gridNodeY - 10; // start 10px above grid/battery baseline
    const humpWidth = 22; // tighter hump span
    const humpHeight = 7;
    const humpHeightAdj = humpHeight / renderScaleY; // keep fixed screen px
    const humpStartX = homeCenterX - humpWidth / 2;
    const humpEndX = homeCenterX + humpWidth / 2;
    const humpPeakY = gridNodeY - humpHeightAdj;
    const humpCtrlInX = humpStartX + humpWidth * 0.25;
    const humpCtrlOutX = humpEndX - humpWidth * 0.25;
    const pvGridEndX = homeCenterX - 10; // Grid->PV ends 10px left of center
    const pvGridTurnRadius = 8; // slightly larger radius for the grid→PV corner
    const pvBatteryStartX = homeCenterX + 10; // shift PV→Battery start 10px right of center
    const pvBatteryEndY = gridNodeY - 10; // lift PV→Battery end 10px above grid/battery baseline
    const gridHomeStartY = gridNodeY + 10; // drop grid→home start 10px below grid/battery baseline
    const gridHomeEndX = homeCenterX - 10; // end 10px left of home center
    const batteryHomeStartY = gridNodeY + 10; // drop battery→home start 10px below grid/battery baseline
    const batteryHomeEndX = homeCenterX + 10; // end 10px right of home center
    const pvNode = { x: pvCenterX, y: pvNodeY };
    const gridNode = { x: gridLineStartX, y: gridNodeY };
    const batteryNode = { x: gridLineEndX, y: gridNodeY };
    const homeNode = { x: homeCenterX, y: homeLineEndY };

    return {
      designWidth,
      designHeight,
      defaultWidth,
      defaultHeight,
      hostRect,
      outerWidth,
      outerHeight,
      padX,
      padY,
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
    };
  }

  _renderDeviceLines() {
    const root = this.shadowRoot;
    if (!root) return;
    const group = root.getElementById("device-lines");
    if (!group) return;
    group.innerHTML = "";
    const useDeviceLines = this._useDevicePowerLines();
    const lines = useDeviceLines && Array.isArray(this._deviceLines) ? this._deviceLines : [];
    if (!this._deviceLineStates) this._deviceLineStates = new Map();
    const now = Date.now();
    let nextFlickerEnd = null;
    const ns = "http://www.w3.org/2000/svg";
    for (const ln of lines) {
      const path = document.createElementNS(ns, "path");
      const state = this._deviceLineStates.get(ln.key) || {};
      const flickerUntil = state.flickerUntil || 0;
      const flicker = flickerUntil > now;
      if (flickerUntil > now) {
        nextFlickerEnd = nextFlickerEnd == null ? flickerUntil : Math.min(nextFlickerEnd, flickerUntil);
      }
      const horizDist = Math.abs(ln.homeX - ln.startX);
      const vertDist = Math.abs(ln.downY - ln.upY);
      const cornerRadius = Math.min(4, horizDist / 2, vertDist);
      const dir = ln.homeX >= ln.startX ? 1 : -1;
      const useCurve = cornerRadius > 0 && horizDist > 0;
      const d = useCurve
        ? `M${ln.startX} ${ln.startY} V${ln.downY - cornerRadius} ` +
          `Q${ln.startX} ${ln.downY} ${ln.startX + dir * cornerRadius} ${ln.downY} ` +
          `H${ln.homeX}`
        : `M${ln.startX} ${ln.startY} V${ln.downY} H${ln.homeX}`;
      path.setAttribute(
        "d",
        d
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", ln.color);
      path.setAttribute(
        "class",
        `device-line${flicker ? " device-line-flicker" : ""}`
      );
      path.style.setProperty("--device-line-opacity", String(ln.opacity ?? 1));
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("vector-effect", "non-scaling-stroke");
      if (ln.dashed && !flicker) {
        path.setAttribute("stroke-dasharray", "1 3");
      } else if (this._allowGlowEffects()) {
        path.style.filter = `drop-shadow(0 0 6px ${ln.color})`;
      }
      group.appendChild(path);
    }
    if (nextFlickerEnd == null) {
      for (const state of this._deviceLineStates.values()) {
        const flickerUntil = state?.flickerUntil || 0;
        if (flickerUntil > now) {
          nextFlickerEnd = nextFlickerEnd == null ? flickerUntil : Math.min(nextFlickerEnd, flickerUntil);
        }
      }
    }
    if (nextFlickerEnd != null) {
      const delay = Math.max(0, nextFlickerEnd - now + 20);
      if (this._deviceLineFlickerTimer) clearTimeout(this._deviceLineFlickerTimer);
      this._deviceLineFlickerTimer = setTimeout(() => {
        this._deviceLineFlickerTimer = null;
        this.requestUpdate();
      }, delay);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver((entries) => {
        const rect = entries?.[0]?.contentRect;
        if (rect) {
          const newW = rect.width;
          const newH = rect.height;
          if (newW > 0 && newH > 0 && !this._layoutReady) {
            this._layoutReady = true;
            this.requestUpdate();
          }
          const prevW = this._hostWidth;
          const prevH = this._hostHeight;
          this._hostWidth = newW;
          this._hostHeight = newH;
          const widthChanged = prevW != null && newW !== prevW;
          const heightChanged = prevH != null && newH !== prevH;
          this._externalHeight = newH;
          if (prevW == null || prevH == null || widthChanged || heightChanged) {
            this.requestUpdate();
          }
        }
        this._updateScale();
      });
    }
    this._resizeObserver.observe(this);
    this._updateScale();
  }


  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    super.disconnectedCallback();
  }

  _updateScale() {
    const rect = this.getBoundingClientRect ? this.getBoundingClientRect() : null;
    const hostWidth = this._hostWidth != null ? this._hostWidth : rect?.width || 0;
    if (!hostWidth || hostWidth < 200) {
      this.style.setProperty("--cpc-scale", "1");
      return;
    }
    const baseWidth = 512; // match viewBox width
    const widthScale = hostWidth / baseWidth;
    const scale = Math.max(0.8, Math.min(1.0, widthScale));
    this.style.setProperty("--cpc-scale", scale.toFixed(3));
  }

  _adjustLayout() {
    const root = this.shadowRoot;
    if (!root) return;
    this._updateScale();
    const header = root.querySelector(".pv-header");
    const svg = root.querySelector("svg");
    const line = root.getElementById("line-pv-home");
    if (!header || !svg || !line) return;

    svg.style.marginTop = "0px";
    svg.style.transform = "translateY(0px)";

    const headerBox = header.getBoundingClientRect();
    const lineBox = line.getBoundingClientRect();
    const gap = lineBox.top - headerBox.bottom;

    const desiredGap = 12;
    const delta = gap - desiredGap;

    svg.style.transform = `translateY(${-delta}px)`;
  }

  _getEntityConfig(kind) {
    const ents = this._config?.entities || {};
    const raw = ents[kind];
    if (!raw) return { entity: null };
    if (typeof raw === "string") return { entity: raw };
    if (Array.isArray(raw)) return raw.map((item) => this._normalizeEntityConfig(item));
    if (typeof raw === "object") {
      return { entity: raw.entity || null, color: raw.color, ...raw };
    }
    return { entity: null };
  }

  _normalizeEntityConfig(raw) {
    if (!raw) return { entity: null };
    if (typeof raw === "string") return { entity: raw };
    if (typeof raw === "object") return { entity: raw.entity || null, color: raw.color, ...raw };
    return { entity: null };
  }

  _normalizeLabels(labels, max = 2) {
    if (!labels) return [];
    const arr = Array.isArray(labels) ? labels : [labels];
    const normalized = arr
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") return { entity: item };
        if (typeof item === "object") {
          const entity =
            item.entity ||
            item.entity_id ||
            item.id ||
            item.name ||
            item.source ||
            item.src ||
            item.label;
          if (!entity) return null;
          return {
            entity,
            icon: item.icon,
            color: item.color,
            unit: item.unit,
            ...item,
          };
        }
        return null;
      })
      .filter(Boolean);
    if (max == null) return normalized;
    return normalized.slice(0, Math.max(0, max));
  }

  _normalizeSources(list) {
    return (Array.isArray(list) ? list : [])
      .map((raw) => {
        if (typeof raw === "string") return { entity: raw };
        if (typeof raw === "object" && raw) {
          const explicit =
            raw.entity || raw.entity_id || raw.id || raw.name || raw.source || raw.src;
          if (explicit) return { ...raw, entity: explicit };
          const keys = Object.keys(raw || {}).filter(
            (k) => !["threshold", "color", "icon"].includes(k)
          );
          if (keys.length === 1) return { ...raw, entity: keys[0] };
          return null;
        }
        return null;
      })
      .filter(Boolean);
  }

  _coerceBoolean(val, defaultVal = false) {
    if (val === undefined || val === null) return defaultVal;
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      if (["false", "off", "0", "no"].includes(lower)) return false;
      if (["true", "on", "1", "yes"].includes(lower)) return true;
    }
    return Boolean(val);
  }

  _extractEntityRef(val) {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return (
        val.entity ||
        val.entity_id ||
        val.id ||
        val.name ||
        val.source ||
        val.src ||
        null
      );
    }
    return null;
  }

  _collectEntityIds() {
    const ids = new Set();
    const ents = this._config?.entities || {};
    const add = (id) => {
      if (id) ids.add(id);
    };
    const addEntityConfig = (cfg) => {
      if (!cfg) return;
      if (Array.isArray(cfg)) {
        cfg.forEach(addEntityConfig);
        return;
      }
      add(this._extractEntityRef(cfg));
    };

    addEntityConfig(ents.pv);
    addEntityConfig(ents.grid);
    addEntityConfig(ents.home);
    addEntityConfig(ents.battery);
    add(this._extractEntityRef(ents.grid?.import_entity || ents.grid?.importEntity));
    add(this._extractEntityRef(ents.grid?.export_entity || ents.grid?.exportEntity));

    const pvLabels = this._normalizeLabels(ents.pv?.labels, null);
    const gridLabels = this._normalizeLabels(ents.grid?.labels, null);
    const batteryLabelsSource = Array.isArray(ents.battery)
      ? ents.battery_labels || ents.battery?.labels
      : ents.battery?.labels;
    const batteryLabels = this._normalizeLabels(batteryLabelsSource, null);

    pvLabels.forEach((lbl) => add(this._extractEntityRef(lbl?.entity)));
    gridLabels.forEach((lbl) => add(this._extractEntityRef(lbl?.entity)));
    batteryLabels.forEach((lbl) => add(this._extractEntityRef(lbl?.entity)));

    const batteryList = Array.isArray(ents.battery)
      ? ents.battery
      : ents.battery
      ? [ents.battery]
      : [];
    for (const cfg of batteryList) {
      add(this._extractEntityRef(cfg?.charge_entity || cfg?.chargeEntity));
      add(this._extractEntityRef(cfg?.discharge_entity || cfg?.dischargeEntity));
      const socRef =
        this._extractEntityRef(cfg?.battery_soc) ||
        this._extractEntityRef(cfg?.soc) ||
        this._extractEntityRef(cfg?.soc_entity) ||
        this._extractEntityRef(cfg?.battery_soc_entity) ||
        this._extractEntityRef(cfg?.battery_soc_id) ||
        this._extractEntityRef(cfg?.soc_entity_id);
      add(socRef);
    }

    const { sources } = this._getSourcesConfig();
    sources.forEach((src) => {
      add(this._extractEntityRef(src?.entity));
      add(this._extractEntityRef(src?.switch_entity));
      add(this._extractEntityRef(src?.name));
    });

    return ids;
  }

  _shouldUpdateForHass(hass) {
    const themeMode = hass?.themes?.darkMode ?? null;
    if (themeMode !== this._lastThemeMode) {
      this._lastThemeMode = themeMode;
      return true;
    }

    const ids = this._trackedEntityIds || new Set();
    if (!ids.size) return true;

    let changed = false;
    for (const id of ids) {
      const st = hass?.states?.[id];
      const stamp = st ? `${st.last_changed}|${st.last_updated}` : "missing";
      const prev = this._lastEntityStates.get(id);
      if (prev !== stamp) {
        this._lastEntityStates.set(id, stamp);
        changed = true;
      }
    }
    if (!changed) return false;

    for (const id of Array.from(this._lastEntityStates.keys())) {
      if (!ids.has(id)) this._lastEntityStates.delete(id);
    }
    return true;
  }

  _getCurveFactor() {
    const raw = Number(this._config?.curve_factor);
    if (Number.isFinite(raw)) return Math.min(5, Math.max(0, raw));
    const legacyCurved = this._coerceBoolean(this._config?.curved_lines, true);
    return legacyCurved ? 1 : 0;
  }

  _useCurvedLines() {
    return this._getCurveFactor() > 0;
  }

  _useDevicePowerLines() {
    return this._coerceBoolean(this._config?.enable_device_power_lines, false);
  }

  _allowGlowEffects() {
    if (this._isLightTheme()) return false;
    return !this._coerceBoolean(this._config?.remove_glow_effects, false);
  }

  _getSourcesConfig() {
    // Prefer new `devices` key; fall back to legacy `sources` for backwards compatibility.
    const raw =
      this._config?.entities?.devices ??
      this._config?.entities?.sources;
    const hasTopLevelNew = Object.prototype.hasOwnProperty.call(
      this._config || {},
      "subtract_devices_from_home"
    );
    const hasTopLevelLegacy = Object.prototype.hasOwnProperty.call(this._config || {}, "subtract_from_home");
    const topLevelNew = hasTopLevelNew
      ? this._coerceBoolean(this._config?.subtract_devices_from_home, true)
      : null;
    const topLevelLegacy = hasTopLevelLegacy
      ? this._coerceBoolean(this._config?.subtract_from_home, false)
      : null;
    const hasTopLevelSubtract = hasTopLevelNew || hasTopLevelLegacy;
    const topLevelSubtract = topLevelNew != null ? topLevelNew : topLevelLegacy;
    let subtractFromHome = topLevelSubtract != null ? topLevelSubtract : false;
    let list = [];

    if (Array.isArray(raw)) {
      list = raw;
    } else if (raw && typeof raw === "object") {
      if (!hasTopLevelSubtract && Object.prototype.hasOwnProperty.call(raw, "subtract_from_home")) {
        subtractFromHome = this._coerceBoolean(raw.subtract_from_home, true);
      }
      if (Array.isArray(raw.list)) list = raw.list;
      else if (Array.isArray(raw.items)) list = raw.items;
      else if (Array.isArray(raw.entities)) list = raw.entities;
      else if (Array.isArray(raw.sources)) list = raw.sources;
    }

    return { sources: this._normalizeSources(list), subtractFromHome };
  }

  _getColor(kind, entityCfg) {
    const cfg = this._config || {};
    const colors = cfg.colors || {};

    const defaults = {
      pv: "var(--energy-solar-color)",
      grid: "var(--energy-grid-consumption-color)",
      home: "var(--energy-battery-out-color)",
      battery: "var(--energy-battery-in-color)",
    };

    return (
      entityCfg?.color ||
      colors[kind] ||
      cfg[`${kind}_color`] ||
      defaults[kind]
    );
  }

  _getHeightFactor() {
    return 1;
  }

  _getEffectiveHeightFactor(batteryCount = 1) {
    return 1;
  }

  _isLightTheme() {
    const theme = this.hass?.themes;
    const body = document?.body;
    const root = document?.documentElement;
    const hasDarkClass = body?.classList?.contains("theme-dark") || body?.classList?.contains("dark");
    const hasLightClass = body?.classList?.contains("theme-light");
    const dataTheme = String(root?.getAttribute("data-theme") || "").toLowerCase();
    if (theme?.darkMode === true) return false;
    if (theme?.darkMode === false && !hasDarkClass) return true;
    if (hasDarkClass) return false;
    if (hasLightClass) return true;
    if (dataTheme.includes("dark")) return false;
    if (dataTheme.includes("light")) return true;
    const scheme = root ? getComputedStyle(root).getPropertyValue("color-scheme") : "";
    if (scheme && scheme.includes("dark") && !scheme.includes("light")) return false;
    const prefersDark = window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    if (prefersDark) return false;
    return false;
  }

  _formatEntity(entityId, decimals = 1, attribute = null, unitOverride = null, name = null) {
    if (!this.hass || !entityId) return name ? `${name}: ` : "";
    const prefix = name ? `${name}: ` : "";
    const obj = this.hass.states[entityId];
    if (!obj) return prefix;
    const s = attribute ? obj.attributes?.[attribute] : obj.state;
    const u = obj.attributes.unit_of_measurement;
    if (unitOverride) {
      const num = this._parseNumberStrict(s);
      const uo = String(unitOverride || "").toLowerCase();
      const dec = uo === "w" ? 0 : decimals;
      if (num != null) {
        if (["w", "kw", "mw"].includes(uo)) {
          const watts = this._toWatts(num, u);
          const factor = uo === "kw" ? 1 / 1000 : uo === "mw" ? 1 / 1000000 : 1;
          const converted = watts * factor;
          return `${prefix}${converted.toFixed(dec)} ${unitOverride}`;
        }
        return `${prefix}${num.toFixed(dec)} ${unitOverride}`;
      }
      return `${prefix}${s} ${unitOverride}`;
    }
    if (s === "unknown" || s === "unavailable") return `${prefix}${s}`;
    const num = this._parseNumberStrict(s);
    const uLower = typeof u === "string" ? u.toLowerCase() : "";
    const decimalsToUse = uLower === "w" ? 0 : decimals;
    // Auto convert kWh → MWh when large
    if (num != null && uLower === "kwh" && Math.abs(num) >= 1000) {
      const mwh = num / 1000;
      return `${prefix}${mwh.toFixed(decimals)} MWh`;
    }
    if (this._isWattToKw(num, u)) return `${prefix}${this._formatPower(num, u, decimals)}`;
    if (num != null) {
      if (u) return `${prefix}${num.toFixed(decimalsToUse)} ${u}`;
      return `${prefix}${num.toFixed(decimalsToUse)}`;
    }
    return `${prefix}${u ? `${s} ${u}` : s}`;
  }

  _formatEntityStateWithUnit(entityId) {
    if (!this.hass || !entityId) return "";
    const obj = this.hass.states[entityId];
    if (!obj) return "";
    const state = obj.state;
    const unit = obj.attributes?.unit_of_measurement;
    if (unit) return `${state} ${unit}`;
    return state == null ? "" : String(state);
  }

  _isWattToKw(num, unit) {
    return unit && unit.toLowerCase() === "w" && Number.isFinite(num) && Math.abs(num) >= 1000;
  }

  _getPowerUnit() {
    const raw = String(this._config?.power_unit || "").trim().toLowerCase();
    if (["w", "kw", "mw"].includes(raw)) return raw;
    return null;
  }

  _formatPowerWithOverride(watts, decimals = 1, fallbackUnit = "W", unitOverride = null) {
    if (unitOverride && Number.isFinite(watts)) {
      const u = String(unitOverride || "").toLowerCase();
      const factor = u === "kw" ? 1 / 1000 : u === "mw" ? 1 / 1000000 : 1;
      const converted = watts * factor;
      const dec = u === "w" ? 0 : decimals;
      const label = u === "kw" ? "kW" : u === "mw" ? "mW" : unitOverride;
      return `${converted.toFixed(dec)} ${label}`;
    }
    const cardUnit = this._getPowerUnit();
    if (cardUnit && Number.isFinite(watts)) {
      const factor = cardUnit === "kw" ? 1 / 1000 : cardUnit === "mw" ? 1000 : 1;
      const converted = watts * factor;
      const dec = cardUnit === "w" ? 0 : decimals;
      const label = cardUnit === "kw" ? "kW" : cardUnit === "mw" ? "mW" : "W";
      return `${converted.toFixed(dec)} ${label}`;
    }
    return this._formatPower(watts, fallbackUnit, decimals, unitOverride);
  }

  _formatPower(num, unit, decimals = 1, unitOverride = null) {
    const displayUnit = unitOverride || unit;
    const isWatts = String(displayUnit || "").toLowerCase() === "w";
    const dec = isWatts ? 0 : decimals;
    if (unitOverride) {
      return `${num.toFixed(dec)} ${displayUnit}`;
    }
    if (this._isWattToKw(num, unit)) {
      const kw = num / 1000;
      return `${kw.toFixed(decimals)} kW`;
    }
    if (displayUnit) return `${num.toFixed(dec)} ${displayUnit}`;
    return String(num);
  }

  _getEntityIcon(entityId, fallback = "mdi:power-plug") {
    if (!entityId) return fallback;
    const st = this.hass?.states?.[entityId];
    return st?.attributes?.icon || fallback;
  }

  _getBatteryIcon(soc) {
    const pct = Math.max(0, Math.min(100, Number.isFinite(soc) ? soc : 0));
    if (pct >= 95) return "mdi:battery";
    if (pct >= 85) return "mdi:battery-90";
    if (pct >= 75) return "mdi:battery-80";
    if (pct >= 65) return "mdi:battery-70";
    if (pct >= 55) return "mdi:battery-60";
    if (pct >= 45) return "mdi:battery-50";
    if (pct >= 35) return "mdi:battery-40";
    if (pct >= 25) return "mdi:battery-30";
    if (pct >= 15) return "mdi:battery-20";
    if (pct >= 5) return "mdi:battery-10";
    return "mdi:battery-outline";
  }

  _getLabelIcon(entityId, attribute = null, fallback = "mdi:tag-text-outline") {
    if (!entityId) return fallback;
    const st = this.hass?.states?.[entityId];
    const entityIcon = st?.attributes?.icon;
    const deviceClass = String(st?.attributes?.device_class || "").toLowerCase();
    if (entityIcon) return entityIcon;
    if (deviceClass === "battery") {
      const soc = this._getNumeric(entityId, attribute);
      return this._getBatteryIcon(soc);
    }
    return this._getEntityIcon(entityId, fallback);
  }

  _getMdiPath(icon) {
    if (!icon) return null;
    const cached = this._iconPathCache?.get(icon);
    if (cached) return cached;
    const parts = String(icon).split(":");
    const set = parts[0];
    const name = parts[1];
    if (!set || !name) return null;
    const registry = window.customIcons?.[set];
    const getIcon = registry?.getIcon;
    if (typeof getIcon !== "function") {
      const fallback = this._getMdiFallbackPath(set, name);
      if (fallback) {
        if (!this._iconPathCache) this._iconPathCache = new Map();
        this._iconPathCache.set(icon, fallback);
        return fallback;
      }
      this._queueHaIconPath(icon);
      return null;
    }
    const iconResult = getIcon(name);
    if (!iconResult) return null;
    if (typeof iconResult.then === "function") {
      iconResult
        .then((resolved) => {
          const path = this._extractIconPath(resolved);
          if (path) {
            if (!this._iconPathCache) this._iconPathCache = new Map();
            this._iconPathCache.set(icon, path);
            this.requestUpdate();
          }
        })
        .catch(() => {});
      return null;
    }
    const path = this._extractIconPath(iconResult) || this._getMdiFallbackPath(set, name);
    if (path) {
      if (!this._iconPathCache) this._iconPathCache = new Map();
      this._iconPathCache.set(icon, path);
      return path;
    }
    this._queueHaIconPath(icon);
    return null;
  }

  _getMdiFallbackPath(set, name) {
    if (set !== "mdi" || !name) return null;
    const mdiIcons = window.mdiIcons || window.MDI_ICONS || window.mdiSvgPaths || null;
    if (!mdiIcons) return null;
    if (typeof mdiIcons[name] === "string") return mdiIcons[name];
    const camel = name
      .split("-")
      .map((part, idx) => (idx === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join("");
    const key = `mdi${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
    if (typeof mdiIcons[key] === "string") return mdiIcons[key];
    return null;
  }

  _extractIconPath(iconResult) {
    if (!iconResult) return null;
    if (typeof iconResult === "string") return iconResult;
    if (typeof iconResult.path === "string") return iconResult.path;
    if (Array.isArray(iconResult.path)) return iconResult.path.join(" ");
    if (typeof iconResult.body === "string") {
      const m = iconResult.body.match(/d="([^"]+)"/);
      if (m) return m[1];
    }
    return null;
  }

  _queueHaIconPath(icon) {
    if (!icon || !this.shadowRoot) return;
    if (!this._iconPathPending) this._iconPathPending = new Set();
    if (this._iconPathPending.has(icon)) return;
    this._iconPathPending.add(icon);
    requestAnimationFrame(async () => {
      try {
        if (this.updateComplete) await this.updateComplete;
        await customElements.whenDefined("ha-icon");
        const container = this.shadowRoot?.getElementById("icon-probe");
        if (!container) return;
        const probe = document.createElement("ha-icon");
        probe.style.display = "none";
        probe.icon = icon;
        if (this.hass) probe.hass = this.hass;
        container.appendChild(probe);
        if (probe.updateComplete) await probe.updateComplete;
        const directPath = probe.shadowRoot?.querySelector("path");
        const svgIcon = probe.shadowRoot?.querySelector("ha-svg-icon");
        const nestedPath = svgIcon?.shadowRoot?.querySelector("path") || null;
        const pathEl = directPath || nestedPath;
        const d = pathEl?.getAttribute?.("d") || null;
        if (d) {
          if (!this._iconPathCache) this._iconPathCache = new Map();
          this._iconPathCache.set(icon, d);
          this.requestUpdate();
        }
        container.removeChild(probe);
      } finally {
        this._iconPathPending.delete(icon);
      }
    });
  }

  _isPowerDevice(entityId) {
    if (!entityId) return false;
    const st = this.hass?.states?.[entityId];
    const deviceClass = String(st?.attributes?.device_class || "").toLowerCase();
    return deviceClass === "power";
  }

  _getBatterySocRef(cfg) {
    if (!cfg) return null;
    const entityOverride =
      cfg.battery_soc_entity || cfg.battery_soc_id || cfg.soc_entity || cfg.soc_entity_id;
    const attrOverride =
      cfg.battery_soc_attribute || cfg.battery_soc_attr || cfg.soc_attribute || cfg.soc_attr;
    let src = cfg.battery_soc || cfg.soc || cfg.soc_entity;
    if (!src && entityOverride) {
      src = { entity: entityOverride, attribute: attrOverride || null };
    }
    if (!src) return null;
    const resolve = (val) => {
      if (typeof val === "string") return { entity: val, attribute: null };
      if (typeof val === "object" && val) {
        const entity =
          val.entity ||
          val.entity_id ||
          val.id ||
          val.name ||
          val.source ||
          val.src ||
          val.soc;
        const attribute = val.attribute || val.attr || attrOverride || null;
        if (entity) return { entity, attribute };
      }
      return null;
    };
    return resolve(src);
  }

  _getBatterySocEntity(cfg) {
    const ref = this._getBatterySocRef(cfg);
    return ref?.entity || null;
  }

  _getBatterySocValue(cfg) {
    const ref = this._getBatterySocRef(cfg);
    if (!ref || !ref.entity) return null;
    const st = this.hass?.states?.[ref.entity];
    if (!st) return null;
    const raw = ref.attribute ? st.attributes?.[ref.attribute] : st.state;
    const num = parseFloat(raw);
    return Number.isFinite(num) ? num : null;
  }

  _toWatts(val, unit, allowNull = false) {
    const n = typeof val === "number" ? val : parseFloat(val);
    if (!Number.isFinite(n)) return allowNull ? null : 0;
    const u = String(unit || "").toLowerCase();
    if (u === "kw") return n * 1000;
    if (u === "mw") return n * 1000000;
    return n;
  }

  _fromWatts(val, unit) {
    const u = String(unit || "").toLowerCase();
    if (u === "kw") return val / 1000;
    if (u === "mw") return val / 1000000;
    return val;
  }

  _parseThreshold(val) {
    const n = typeof val === "string" ? parseFloat(val) : val;
    return Number.isFinite(n) ? n : null;
  }

  _parseNumberStrict(val) {
    if (typeof val === "number") return Number.isFinite(val) ? val : null;
    if (typeof val !== "string") return null;
    const s = val.trim();
    if (!s) return null;
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s)) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  _isUnavailableState(raw) {
    const s = String(raw ?? "").toLowerCase();
    return s === "unknown" || s === "unavailable";
  }

  _parseDecimalPlaces(val) {
    const n = typeof val === "string" ? parseInt(val, 10) : val;
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }

  _getCardDecimalPlaces() {
    const parsed = this._parseDecimalPlaces(this._config?.decimal_places);
    return parsed == null ? null : parsed;
  }

  _getDecimalPlaces(cfg) {
    const parsed = this._parseDecimalPlaces(cfg?.decimal_places);
    if (parsed != null) return parsed;
    const cardLevel = this._getCardDecimalPlaces();
    if (cardLevel != null) return cardLevel;
    return 1;
  }

  _getUnitOverride(cfg) {
    return cfg?.unit || cfg?.unit_of_measurement || null;
  }

  _opacityFor(value, threshold) {
    if (!Number.isFinite(value)) return 1;
    if (value === 0) return 0.4;
    if (threshold == null) return 1;
    return this._isThresholdSuppressed(value, threshold) ? 0.4 : 1;
  }

  _isThresholdSuppressed(value, threshold) {
    if (!Number.isFinite(value) || !Number.isFinite(threshold)) return false;
    if (threshold <= 0) return value <= threshold;
    return Math.abs(value) < threshold;
  }

  _isBelowThreshold(value, threshold) {
    return this._isThresholdSuppressed(value, threshold);
  }

  _getNumeric(entityId, attribute = null) {
    if (!this.hass || !entityId) return 0;
    const st = this.hass.states[entityId];
    if (!st) return 0;
    const raw = attribute ? st.attributes?.[attribute] : st.state;
    const v = this._parseNumberStrict(raw);
    return v == null ? 0 : v;
  }

  _getNumericMaybe(entityId, attribute = null) {
    if (!this.hass || !entityId) return null;
    const st = this.hass.states[entityId];
    if (!st) return null;
    const raw = attribute ? st.attributes?.[attribute] : st.state;
    return this._parseNumberStrict(raw);
  }

  _getPowerMeta(entityId, unitOverride = null, attribute = null) {
    const value = this._getNumeric(entityId, attribute);
    const unit =
      unitOverride ||
      (entityId && this.hass?.states?.[entityId]?.attributes?.unit_of_measurement) ||
      "";
    return { value, unit, watts: this._toWatts(value, unit) };
  }

  _getDirectionalPowerMeta(importEntity, exportEntity) {
    if (!this.hass) return { value: null, unit: "", watts: null };
    const imp = importEntity ? this._getNumericMaybe(importEntity) : null;
    const exp = exportEntity ? this._getNumericMaybe(exportEntity) : null;
    if (imp == null && exp == null) return { value: null, unit: "", watts: null };
    const unit =
      (importEntity && this.hass?.states?.[importEntity]?.attributes?.unit_of_measurement) ||
      (exportEntity && this.hass?.states?.[exportEntity]?.attributes?.unit_of_measurement) ||
      "";
    const value = (imp ?? 0) - (exp ?? 0);
    const watts = this._toWatts(value, unit, true);
    return { value, unit, watts };
  }

  _getGridPowerMeta(gridCfg, unitOverride = null) {
    const importEntity = gridCfg?.import_entity || gridCfg?.importEntity || null;
    const exportEntity = gridCfg?.export_entity || gridCfg?.exportEntity || null;
    if (importEntity || exportEntity) {
      return this._getDirectionalPowerMeta(exportEntity, importEntity);
    }
    return this._getPowerMeta(gridCfg?.entity, unitOverride);
  }

  _getBatteryPowerMeta(cfg) {
    const chargeEntity = cfg?.charge_entity || cfg?.chargeEntity || null;
    const dischargeEntity = cfg?.discharge_entity || cfg?.dischargeEntity || null;
    if (chargeEntity || dischargeEntity) {
      return this._getDirectionalPowerMeta(dischargeEntity, chargeEntity);
    }
    return null;
  }

  _setLineColor(lineId, color, active = false) {
    const el = this.shadowRoot?.getElementById(lineId);
    if (!el) return;
    el.style.stroke = color;
    el.style.strokeOpacity = active ? "1" : "0.15";
    const allowGlow = this._allowGlowEffects();
    el.style.filter = active && allowGlow ? `drop-shadow(0 0 6px ${color})` : "none";
  }

  _setHomeGradient(pvToHome, batteryToHome, gridToHome, pvColor, batteryColor, gridColor, homeColor) {
    const gradient = this.shadowRoot?.getElementById("home-gradient");
    const stop1 = this.shadowRoot?.getElementById("home-stop-1");
    const stop2 = this.shadowRoot?.getElementById("home-stop-2");
    const stop3 = this.shadowRoot?.getElementById("home-stop-3");
    const stop4 = this.shadowRoot?.getElementById("home-stop-4");
    const stop5 = this.shadowRoot?.getElementById("home-stop-5");
    const stop6 = this.shadowRoot?.getElementById("home-stop-6");
    if (!gradient || !stop1 || !stop2 || !stop3 || !stop4 || !stop5 || !stop6) return;

    const entries = [
      { key: "grid", value: gridToHome, color: gridColor, order: 0, line: { x1: 7, y1: 7, x2: 19, y2: 20 } },
      { key: "pv", value: pvToHome, color: pvColor, order: 1, line: { x1: 12, y1: 3, x2: 12, y2: 20 } },
      { key: "battery", value: batteryToHome, color: batteryColor, order: 2, line: { x1: 17, y1: 7, x2: 5, y2: 20 } },
    ]
      .filter((item) => item.value > 0)
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return a.order - b.order;
      });

    const allEqualLine = { x1: 2, y1: 5, x2: 22, y2: 5 };
    const approxEqual = (a, b) => Math.abs(a - b) <= 0.01;

    let gradientLine = allEqualLine;
    if (entries.length === 0) {
      gradientLine = allEqualLine;
    } else if (entries.length === 1) {
      gradientLine = entries[0].line;
    } else {
      const raw = {
        grid: gridToHome,
        pv: pvToHome,
        battery: batteryToHome,
      };
      const maxValue = Math.max(raw.grid, raw.pv, raw.battery);
      const maxKeys = [
        raw.grid > 0 && approxEqual(raw.grid, maxValue) ? "grid" : null,
        raw.pv > 0 && approxEqual(raw.pv, maxValue) ? "pv" : null,
        raw.battery > 0 && approxEqual(raw.battery, maxValue) ? "battery" : null,
      ].filter(Boolean);

      if (maxKeys.length === 3) {
        gradientLine = allEqualLine;
      } else {
        const preferredKey =
          maxKeys.includes("grid")
            ? "grid"
            : maxKeys.includes("pv")
            ? "pv"
            : "battery";
        const selected = entries.find((item) => item.key === preferredKey) || entries[0];
        gradientLine = selected.line;
      }
    }

    const homeMarker = this.shadowRoot?.querySelector(".home-marker");
    const winnerColor = entries[0]?.color || homeColor;
    if (homeMarker) {
      homeMarker.style.setProperty("--cpc-home-winner", winnerColor);
    }
    if (this._config?.disable_home_gradient) return;

    gradient.setAttribute("x1", String(gradientLine.x1));
    gradient.setAttribute("y1", String(gradientLine.y1));
    gradient.setAttribute("x2", String(gradientLine.x2));
    gradient.setAttribute("y2", String(gradientLine.y2));

    const total = entries.reduce((sum, item) => sum + item.value, 0);
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const clampPct = (value) => `${clamp(value, 0, 100)}%`;
    const blendWidth = 25;
    const setStop = (el, offset, color) => {
      el.setAttribute("offset", clampPct(offset));
      el.setAttribute("stop-color", color);
    };
    const setStops = (stops) => {
      stops.forEach((s) => setStop(s.el, s.offset, s.color));
    };
    const getOffsetPct = (el) => {
      const raw = el.getAttribute("offset") || "0";
      const num = parseFloat(raw);
      return Number.isFinite(num) ? num : 0;
    };

    if (total <= 0) {
      if (homeMarker) {
        homeMarker.style.setProperty("--cpc-home-glow-1", homeColor);
        homeMarker.style.setProperty("--cpc-home-glow-2", homeColor);
        homeMarker.style.setProperty("--cpc-home-glow-3", homeColor);
      }
      setStops([
        { el: stop1, offset: 0, color: homeColor },
        { el: stop2, offset: 100, color: homeColor },
        { el: stop3, offset: 100, color: homeColor },
        { el: stop4, offset: 100, color: homeColor },
        { el: stop5, offset: 100, color: homeColor },
        { el: stop6, offset: 100, color: homeColor },
      ]);
      return;
    }

    const color1 = entries[0]?.color || homeColor;
    const color2 = entries[1]?.color || color1;
    const color3 = entries[2]?.color || color2;
    const share1 = (entries[0]?.value / total) * 100;
    const share2 = entries.length >= 2 ? ((entries[0].value + entries[1].value) / total) * 100 : share1;
    let targetStops = [];
    if (homeMarker) {
      homeMarker.style.setProperty("--cpc-home-glow-1", color1);
      homeMarker.style.setProperty("--cpc-home-glow-2", color2);
      homeMarker.style.setProperty("--cpc-home-glow-3", color3);
    }

    if (entries.length === 1) {
      targetStops = [
        { el: stop1, offset: 0, color: color1 },
        { el: stop2, offset: 100, color: color1 },
        { el: stop3, offset: 100, color: color1 },
        { el: stop4, offset: 100, color: color1 },
        { el: stop5, offset: 100, color: color1 },
        { el: stop6, offset: 100, color: color1 },
      ];
      setStops(targetStops);
      return;
    }

    if (entries.length === 2) {
      const halfBlend = Math.min(blendWidth / 2, share1, 100 - share1);
      targetStops = [
        { el: stop1, offset: 0, color: color1 },
        { el: stop2, offset: share1 - halfBlend, color: color1 },
        { el: stop3, offset: share1 + halfBlend, color: color2 },
        { el: stop4, offset: 100, color: color2 },
        { el: stop5, offset: 100, color: color2 },
        { el: stop6, offset: 100, color: color2 },
      ];
    } else {
      const halfBlend1 = Math.min(blendWidth / 2, share1, share2 - share1);
      const halfBlend2 = Math.min(blendWidth / 2, 100 - share2, share2 - share1);
      targetStops = [
        { el: stop1, offset: 0, color: color1 },
        { el: stop2, offset: share1 - halfBlend1, color: color1 },
        { el: stop3, offset: share1 + halfBlend1, color: color2 },
        { el: stop4, offset: share2 - halfBlend2, color: color2 },
        { el: stop5, offset: share2 + halfBlend2, color: color3 },
        { el: stop6, offset: 100, color: color3 },
      ];
    }

    const offsetChanged = targetStops.some(
      (s) => Math.abs(getOffsetPct(s.el) - s.offset) > 0.5
    );
    if (offsetChanged) {
      const dominant = color1;
      [stop1, stop2, stop3, stop4, stop5, stop6].forEach((el) => {
        el.setAttribute("stop-color", dominant);
      });
      if (this._homeGradientFrame) cancelAnimationFrame(this._homeGradientFrame);
      this._homeGradientFrame = requestAnimationFrame(() => {
        setStops(targetStops);
      });
      return;
    }
    setStops(targetStops);
  }

  _updateFlows() {
    if (!this._config || !this.hass) return;
    if (!this.shadowRoot) {
      this._pendingFlowUpdate = true;
      return;
    }
    
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
    const thresholdMode = String(this._config?.threshold_mode || "calculations").toLowerCase();
    const useThresholdForCalc = thresholdMode === "calculations";
    const invertGrid = Boolean(gridCfg?.invert_state_values);
    const invertBattery = Boolean(batteryCfg?.invert_state_values);
    const gridUsesDirectional =
      Boolean(gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity);
    const invertGridEffective = invertGrid && !gridUsesDirectional;
    const pvLabels = this._normalizeLabels(pvCfg?.labels, null);
    const gridLabelsRaw = this._normalizeLabels(gridCfg?.labels, null);
    const batteryLabelsSource = Array.isArray(this._config?.entities?.battery)
      ? this._config?.entities?.battery_labels || this._config?.entities?.battery?.labels
      : batteryCfg?.labels;
    const batteryLabels = this._normalizeLabels(batteryLabelsSource, null);
    const hasAnyLabels = pvLabels.length > 0 || gridLabelsRaw.length > 0 || batteryLabels.length > 0;
    const pvUnit =
      this.hass?.states?.[pvCfg.entity]?.attributes?.unit_of_measurement ||
      "";
    const curvedLines = this._useCurvedLines();
    const gridUnit =
      this.hass?.states?.[gridCfg.entity]?.attributes?.unit_of_measurement ||
      "";
    const batteryUnit =
      this.hass?.states?.[batteryCfg.entity]?.attributes?.unit_of_measurement ||
      "";
    const homeUnit =
      this.hass?.states?.[homeCfg.entity]?.attributes?.unit_of_measurement ||
      "";

    const applyThreshold = (value, threshold) => {
      if (threshold == null) return value;
      return this._isThresholdSuppressed(value, threshold) ? 0 : value;
    };

    const pvThreshold = this._toWatts(this._parseThreshold(pvCfg.threshold), "W", true);
    const gridThreshold = this._toWatts(this._parseThreshold(gridCfg.threshold), "W", true);
    const batteryThreshold = null; // thresholds applied per battery above

    const pvMeta = this._getPowerMeta(pvCfg.entity, pvUnit);
    const gridMeta = this._getGridPowerMeta(gridCfg, gridUnit);
    let batteryComputed = [];
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

      let cx = 0;
      let cy = 0;
      const curGeom = animState.geom || geom;

      if (curGeom?.mode === "path") {
        if (!animState.pathEl) {
          animState.pathEl = this.shadowRoot?.getElementById(curGeom.pathId) || null;
          animState.pathLength = animState.pathEl?.getTotalLength ? animState.pathEl.getTotalLength() : 0;
        }
        if (animState.pathEl && animState.pathLength > 0) {
          const pathT = curGeom.reverse ? 1 - t : t;
          const pt = animState.pathEl.getPointAtLength(pathT * animState.pathLength);
          cx = pt.x;
          cy = pt.y;
        } else if (curGeom.fallback) {
          const fb = curGeom.fallback;
          if (fb.mode === "line") {
            cx = fb.x1 + (fb.x2 - fb.x1) * t;
            cy = fb.y1 + (fb.y2 - fb.y1) * t;
          }
        }
      } else if (curGeom?.mode === "quad") {
        const inv = 1 - t;
        cx = inv * inv * curGeom.x0 + 2 * inv * t * curGeom.cx + t * t * curGeom.x1;
        cy = inv * inv * curGeom.y0 + 2 * inv * t * curGeom.cy + t * t * curGeom.y1;
      } else if (curGeom?.mode === "line") {
        cx = curGeom.x1 + (curGeom.x2 - curGeom.x1) * t;
        cy = curGeom.y1 + (curGeom.y2 - curGeom.y1) * t;
      }

      if (animState.lockCXPercent) {
        dot.setAttribute("cx", animState.lockCXPercent);
      } else {
        dot.setAttribute("cx", String(cx));
      }
      dot.setAttribute("cy", String(cy));

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

  _renderLabels(labels, position, parentKey) {
    if (!labels || !labels.length) return "";
    const parentCfg = this._getEntityConfig(parentKey);
    const normalized = this._normalizeLabels(labels, null);
    if (!this._labelFlickerStates) this._labelFlickerStates = new Map();
    const now = Date.now();
    let nextFlickerEnd = null;

    const items = normalized.map((lbl, idx) => {
      const entityId = lbl.entity;
      const attribute = lbl.attribute || null;
      const rawDecimalPlaces = lbl.decimal_places ?? parentCfg?.decimal_places;
      const decimals = this._getDecimalPlaces({ decimal_places: rawDecimalPlaces });
      const val = this._getNumeric(entityId, attribute);
      const icon = lbl.icon || this._getLabelIcon(entityId, attribute);
      const unitOverride = this._getUnitOverride(lbl);
      const thr = this._parseThreshold(lbl.threshold);
      const isBelow = thr != null ? this._isThresholdSuppressed(val, thr) : false;
      const opacity = this._opacityFor(val, thr);
      const color = lbl.color || parentCfg?.color || "inherit";
      const allowGlow = this._allowGlowEffects();
      const dropShadow =
        allowGlow && opacity >= 1 && color !== "inherit" ? `drop-shadow(0 0 6px ${color})` : "none";
      const key = `${parentKey}-label-${idx}-${entityId}`;
      const state = this._labelFlickerStates.get(key) || {};
      const flickerUntil = state.flickerUntil || 0;
      const flicker = flickerUntil > now;
      if (flickerUntil > now) {
        nextFlickerEnd = nextFlickerEnd == null ? flickerUntil : Math.min(nextFlickerEnd, flickerUntil);
      }
      const formattedValue = this._formatEntity(entityId, decimals, attribute, unitOverride, lbl.name);
      const textClass = `aux-sub-label${flicker ? " label-flicker" : ""}`;

      return compactPowerCardHtml`
        <div
          class="aux-marker clickable"
          title=${entityId}
          @click=${(e) => {
            e.stopPropagation();
            this._handleLabelClick(lbl, entityId);
          }}
        >
          <ha-icon
            icon=${icon}
            style=${`color: ${color}; opacity: ${opacity}; filter: ${dropShadow};`}
          ></ha-icon>
          <span
            class=${textClass}
            style=${`opacity: ${opacity}; --label-opacity: ${opacity};`}
          >
            ${formattedValue}
          </span>
        </div>
      `;
    });

    if (nextFlickerEnd != null) {
      const delay = Math.max(0, nextFlickerEnd - now + 20);
      if (this._labelFlickerTimer) clearTimeout(this._labelFlickerTimer);
      this._labelFlickerTimer = setTimeout(() => {
        this._labelFlickerTimer = null;
        this.requestUpdate();
      }, delay);
    }

    return compactPowerCardHtml`<div class=${`aux-column ${position}`}>${items}</div>`;
  }

  _renderDeviceGrid(sourcesConfig) {
    const { sources, subtractFromHome } = sourcesConfig;
    if (!sources || !sources.length) return { template: "", lines: [] };

    const useThresholdForCalc =
      String(this._config?.threshold_mode || "calculations").toLowerCase() ===
      "calculations";
    const layout = this._getLayoutMetrics({
      hasPv:
        this._config?.entities &&
        Object.prototype.hasOwnProperty.call(this._config.entities, "pv"),
      hasBattery:
        this._config?.entities &&
        Object.prototype.hasOwnProperty.call(this._config.entities, "battery"),
      hasAnyLabels: false,
    });
    const { baseWidth, baseHeight, renderScaleY, homeLineEndY, maxItemsByColumns } = layout;

    const visibleItems = [];
    for (let idx = 0; idx < sources.length; idx++) {
      const src = sources[idx];
      const entity = src.entity || null;
      if (!this._isPowerDevice(entity)) continue;
      const attribute = src.attribute || null;
      const srcUnit =
        this.hass?.states?.[entity]?.attributes?.unit_of_measurement ||
        "";
      const meta = this._getPowerMeta(entity, srcUnit, attribute);
      const rawDecimals = src.decimal_places ?? this._config?.decimal_places;
      const decimals = this._getDecimalPlaces({ decimal_places: rawDecimals });
      const thr = this._toWatts(this._parseThreshold(src.threshold), "W", true);
      const forceHide = this._coerceBoolean(src.force_hide_under_threshold, false);
      const displayVal = this._toWatts(meta.value, meta.unit);
      const isUnderThr = thr != null ? this._isThresholdSuppressed(displayVal, thr) : displayVal <= 0;
      if (forceHide && isUnderThr) continue;
      visibleItems.push({ src, entity, attribute, meta, decimals, thr, isUnderThr, idx });
    }

    const count = visibleItems.length;
    if (count === 0) return { template: "", lines: [] };

    const maxColumns = Math.min(8, Math.max(1, maxItemsByColumns));
    const itemsPerRow = Math.min(count, maxColumns);
    const rowCount = Math.ceil(count / itemsPerRow);

    const isSingleRow = rowCount === 1;
    const isOddSingleRow = isSingleRow && count % 2 === 1;
    const centerIdx = isOddSingleRow ? (count - 1) / 2 : null;

    const maxSpanWidth = baseWidth - 110;
    const itemGap = count > 1 ? Math.min(48, maxSpanWidth / Math.max(1, count - 1)) : 0;
    const totalRowWidth = (count - 1) * itemGap;
    const startX = baseWidth / 2 - totalRowWidth / 2;

    const lines = [];
    const useDeviceLines = this._useDevicePowerLines();
    const renderedItems = [];

    const homeAnchorY = homeLineEndY;
    const homeX = baseWidth / 2;
    const now = Date.now();
    let nextFlickerEnd = null;

    for (let i = 0; i < visibleItems.length; i++) {
      const item = visibleItems[i];
      const { src, entity, attribute, meta, decimals, thr, isUnderThr, idx } = item;
      const name = src.name || this.hass?.states?.[entity]?.attributes?.friendly_name || entity;
      const icon = src.icon || this._getEntityIcon(entity, "mdi:power-plug");

      const col = i % itemsPerRow;
      const row = Math.floor(i / itemsPerRow);
      const itemsInThisRow = Math.min(itemsPerRow, count - row * itemsPerRow);

      let itemX = baseWidth / 2;
      if (itemsInThisRow > 1) {
        const rowGap = count > 1 ? Math.min(48, maxSpanWidth / Math.max(1, itemsInThisRow - 1)) : 0;
        const rowWidth = (itemsInThisRow - 1) * rowGap;
        itemX = baseWidth / 2 - rowWidth / 2 + col * rowGap;
      }

      const isCenter = isOddSingleRow && i === centerIdx;
      const yOffset = isCenter ? -4 : 0;

      const deviceHeight = 30; // approx height of icon + dot
      const verticalGap = 8;
      const topY = baseHeight - deviceHeight - yOffset;

      const hasPerDeviceSubtract = Object.prototype.hasOwnProperty.call(src, "subtract_from_home");
      const isSubtracted = hasPerDeviceSubtract
        ? this._coerceBoolean(src.subtract_from_home, subtractFromHome)
        : subtractFromHome;

      const defaultColor = isSubtracted
        ? "var(--energy-battery-out-color)"
        : "var(--primary-text-color)";
      const color = src.color || defaultColor;

      const opacity = this._opacityFor(meta.watts, thr);
      const unitOverride = this._getUnitOverride(src);
      const formattedVal = this._formatPowerWithOverride(meta.watts, decimals, meta.unit, unitOverride);

      const isActive = useThresholdForCalc
        ? thr != null
          ? !this._isThresholdSuppressed(meta.watts, thr)
          : meta.watts > 0
        : meta.watts > 0;

      const lineStartY = topY + 2;
      const lineDownY = topY + 16;
      const lineUpY = homeAnchorY + 4;

      const lineKey = `device-${idx}-${entity}`;
      const state = this._deviceLineStates.get(lineKey) || {};
      const flickerUntil = state.flickerUntil || 0;
      const flicker = flickerUntil > now;
      if (flickerUntil > now) {
        nextFlickerEnd = nextFlickerEnd == null ? flickerUntil : Math.min(nextFlickerEnd, flickerUntil);
      }

      lines.push({
        key: lineKey,
        startX: itemX,
        startY: lineStartY,
        downY: lineDownY,
        upY: lineUpY,
        homeX,
        color,
        dashed: !isSubtracted,
        opacity,
      });

      const switchEntity = src.switch_entity || null;
      const switchState = switchEntity ? this.hass?.states?.[switchEntity]?.state : null;
      const isSwitchable = Boolean(switchEntity);
      const isSwitchOn = switchState === "on";

      const circleStyle = `color: ${color}; opacity: ${opacity};`;
      const itemTitle = switchEntity ? `${name} (${entity} / ${switchEntity})` : `${name} (${entity})`;

      renderedItems.push(compactPowerCardHtml`
        <div
          class="overlay-item"
          style=${`left: ${itemX}px; top: ${topY}px;`}
        >
          <div
            class="aux-marker clickable"
            title=${itemTitle}
            @click=${(e) => {
              e.stopPropagation();
              if (isSwitchable && switchEntity) {
                this._toggleSwitch(switchEntity);
              } else {
                this._handleDeviceClick(src, entity);
              }
            }}
          >
            <span
              class=${`device-name${flicker ? " device-label-flicker" : ""}`}
              style=${`opacity: ${opacity}; --device-label-opacity: ${opacity};`}
            >
              ${name}
            </span>

            <div
              class=${`device-icon-ring${isSwitchable ? " switchable" : ""}${
                isSwitchOn ? " on" : ""
              }`}
              style=${circleStyle}
            >
              <ha-icon icon=${icon}></ha-icon>
            </div>

            <div class="device-power-dot-wrapper">
              <div
                class=${`device-power-dot${isActive ? " active" : ""}`}
                style=${`color: ${color}; opacity: ${opacity};`}
              ></div>
            </div>

            <span
              class=${`aux-sub-label${flicker ? " device-label-flicker" : ""}`}
              style=${`opacity: ${opacity}; --device-label-opacity: ${opacity};`}
            >
              ${formattedVal}
            </span>
          </div>
        </div>
      `);
    }

    this._deviceLines = lines;

    if (nextFlickerEnd != null) {
      const delay = Math.max(0, nextFlickerEnd - now + 20);
      if (this._deviceLineFlickerTimer) clearTimeout(this._deviceLineFlickerTimer);
      this._deviceLineFlickerTimer = setTimeout(() => {
        this._deviceLineFlickerTimer = null;
        this.requestUpdate();
      }, delay);
    }

    return {
      template: compactPowerCardHtml`${renderedItems}`,
      lines,
    };
  }

  _toggleSwitch(entityId) {
    if (!this.hass || !entityId) return;
    const domain = entityId.split(".")[0];
    const service = "toggle";
    this.hass.callService(domain, service, { entity_id: entityId });
  }

  _handleDeviceClick(src, entityId) {
    const action = src?.tap_action || "more_info";
    if (action === "navigate" && src?.navigation_path) {
      window.history.pushState(null, "", src.navigation_path);
      const ev = new CustomEvent("location-changed", {
        bubbles: true,
        composed: true,
      });
      window.dispatchEvent(ev);
      return;
    }
    const ev = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(ev);
  }

  _handleLabelClick(lbl, defaultEntityId) {
    const action = lbl?.tap_action || "more_info";
    const entityId = lbl?.entity || defaultEntityId;
    if (action === "navigate" && lbl?.navigation_path) {
      window.history.pushState(null, "", lbl.navigation_path);
      const ev = new CustomEvent("location-changed", {
        bubbles: true,
        composed: true,
      });
      window.dispatchEvent(ev);
      return;
    }
    if (!entityId) return;
    const ev = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(ev);
  }

  render() {
    if (!this._config || !this.hass) {
      return compactPowerCardHtml``;
    }

    const ents = this._config?.entities || {};
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

    const pvLabels = this._normalizeLabels(pvCfg?.labels, null);
    const gridLabels = this._normalizeLabels(gridCfg?.labels, null);
    const batteryLabelsSource = Array.isArray(ents.battery)
      ? ents.battery_labels || ents.battery?.labels
      : batteryCfg?.labels;
    const batteryLabels = this._normalizeLabels(batteryLabelsSource, null);

    const hasPv = Object.prototype.hasOwnProperty.call(ents, "pv");
    const hasBattery =
      Object.prototype.hasOwnProperty.call(ents, "battery") &&
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

    const hasAnyLabels =
      pvLabels.length > 0 || gridLabels.length > 0 || batteryLabels.length > 0;

    const layout = this._getLayoutMetrics({
      hasPv,
      hasBattery,
      hasAnyLabels,
    });
    const {
      baseWidth,
      baseHeight,
      viewHeight,
      renderScaleY,
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

    const pvUnitOverride = this._getUnitOverride(pvCfg);
    const gridUnitOverride = this._getUnitOverride(gridCfg);
    const homeUnitOverride = this._getUnitOverride(homeCfg);

    const pvUnit =
      pvUnitOverride ||
      (pvCfg.entity && this.hass?.states?.[pvCfg.entity]?.attributes?.unit_of_measurement) ||
      "";
    const gridUnit =
      gridUnitOverride ||
      (gridCfg.entity && this.hass?.states?.[gridCfg.entity]?.attributes?.unit_of_measurement) ||
      "";
    const homeUnit =
      homeUnitOverride ||
      (homeCfg.entity && this.hass?.states?.[homeCfg.entity]?.attributes?.unit_of_measurement) ||
      "";

    const pvMeta = this._getPowerMeta(pvCfg.entity, pvUnit);
    const gridMeta = this._getGridPowerMeta(gridCfg, gridUnit);
    const homeMeta = this._getPowerMeta(homeCfg.entity, homeUnit);

    const thresholdMode = String(this._config?.threshold_mode || "calculations").toLowerCase();
    const useThresholdForCalc = thresholdMode === "calculations";

    const applyThreshold = (value, threshold) => {
      if (threshold == null) return value;
      return this._isThresholdSuppressed(value, threshold) ? 0 : value;
    };

    const pvThreshold = this._toWatts(this._parseThreshold(pvCfg.threshold), "W", true);
    const gridThreshold = this._toWatts(this._parseThreshold(gridCfg.threshold), "W", true);
    const homeThreshold = this._toWatts(this._parseThreshold(homeCfg.threshold), "W", true);

    const pvRawW = pvMeta.watts;
    const pvCalcW = useThresholdForCalc ? applyThreshold(pvRawW, pvThreshold) : pvRawW;
    const pv = Math.max(pvCalcW, 0);

    const invertGrid = Boolean(gridCfg?.invert_state_values);
    const invertBattery = Boolean(batteryCfg?.invert_state_values);
    const gridUsesDirectional =
      Boolean(gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity);
    const invertGridEffective = invertGrid && !gridUsesDirectional;

    const gridWatts = Number.isFinite(gridMeta?.watts) ? gridMeta.watts : 0;
    const gridBaseW = invertGridEffective ? -gridWatts : gridWatts;

    const batteryItems = batteryList.map((b) => {
      const meta = this._getBatteryPowerMeta(b);
      const u =
        this._getUnitOverride(b) ||
        meta?.unit ||
        (b.entity && this.hass?.states?.[b.entity]?.attributes?.unit_of_measurement) ||
        "";
      const value = meta?.value != null ? meta.value : this._getNumeric(b.entity);
      const watts = Number.isFinite(meta?.watts)
        ? meta.watts
        : this._toWatts(value, u);
      return { cfg: b, value, unit: u, watts };
    });

    const batteryComputed = batteryItems.map((item) => {
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
    const grid = useThresholdForCalc ? applyThreshold(gridBaseW, gridThreshold) : gridBaseW;
    const battery = batteryBaseW;

    const pvDecimals = this._getDecimalPlaces(pvCfg);
    const gridDecimals = this._getDecimalPlaces(gridCfg);
    const homeDecimals = this._getDecimalPlaces(homeCfg);

    const sourcesConfig = this._getSourcesConfig();
    const { template: devicesOverlay } = this._renderDeviceGrid(sourcesConfig);

    const pvColor = this._getColor("pv", pvCfg);
    const gridColor = this._getColor("grid", gridCfg);
    const homeColor = this._getColor("home", homeCfg);
    const batteryColor = this._getColor("battery", batteryCfg);

    const allowGlow = this._allowGlowEffects();
    const hideCardBg = this._coerceBoolean(this._config?.hide_card_background, false);

    const pvOpacity = this._opacityFor(pvRawW, pvThreshold);
    const gridOpacity = this._opacityFor(gridBaseW, gridThreshold);
    const homeOpacity = this._opacityFor(homeMeta.watts, homeThreshold);

    const pvShadow =
      allowGlow && pvOpacity >= 1 ? `drop-shadow(0 0 6px ${pvColor})` : "none";
    const gridShadow =
      allowGlow && gridOpacity >= 1 ? `drop-shadow(0 0 6px ${gridColor})` : "none";
    const homeShadow =
      allowGlow && homeOpacity >= 1 ? `drop-shadow(0 0 6px ${homeColor})` : "none";

    const pvDisplayVal = this._formatPowerWithOverride(
      Math.abs(pvRawW),
      pvDecimals,
      pvMeta.unit,
      pvUnitOverride
    );

    const isGridImportExport = Boolean(gridCfg?.import_entity || gridCfg?.export_entity || gridCfg?.importEntity || gridCfg?.exportEntity);
    const gridImpRaw = gridCfg?.import_entity || gridCfg?.importEntity ? this._getNumericMaybe(gridCfg.import_entity || gridCfg.importEntity) : null;
    const gridExpRaw = gridCfg?.export_entity || gridCfg?.exportEntity ? this._getNumericMaybe(gridCfg.export_entity || gridCfg.exportEntity) : null;

    let gridDisplayVal = "";
    if (isGridImportExport && gridImpRaw != null && gridExpRaw != null) {
      const impVal = this._formatPowerWithOverride(Math.abs(this._toWatts(gridImpRaw, gridUnit)), gridDecimals, gridUnit, gridUnitOverride);
      const expVal = this._formatPowerWithOverride(Math.abs(this._toWatts(gridExpRaw, gridUnit)), gridDecimals, gridUnit, gridUnitOverride);
      gridDisplayVal = `${impVal} / ${expVal}`;
    } else {
      const gridMagW = isGridImportExport
        ? Math.abs(gridBaseW)
        : Math.abs(this._toWatts(gridMeta.value, gridMeta.unit));
      gridDisplayVal = this._formatPowerWithOverride(
        gridMagW,
        gridDecimals,
        gridMeta.unit,
        gridUnitOverride
      );
    }

    const homeValueWatts =
      this._homeEffective != null
        ? this._homeEffective
        : Math.abs(homeMeta.watts);
    const homeDisplayVal = this._formatPowerWithOverride(
      homeValueWatts,
      homeDecimals,
      this._homeEffectiveUnit || homeMeta.unit,
      homeUnitOverride
    );

    const pvIcon = pvCfg.icon || this._getEntityIcon(pvCfg.entity, "mdi:solar-power");
    const gridIcon = gridCfg.icon || this._getEntityIcon(gridCfg.entity, "mdi:transmission-tower");
    const homeIcon = homeCfg.icon || this._getEntityIcon(homeCfg.entity, "mdi:home");

    const curvedLines = this._useCurvedLines();

    const gridBatteryCtrlX = baseWidth / 2;
    const gridBatteryCtrlY = gridNodeY - humpHeightAdj;

    // Direct arc d string with centered hump
    const arcGridBatteryD = curvedLines
      ? `M${gridNode.x} ${gridNode.y} ` +
        `L${humpStartX} ${gridNode.y} ` +
        `C${humpCtrlInX} ${gridNode.y} ${humpStartX} ${humpPeakY} ${homeCenterX} ${humpPeakY} ` +
        `C${humpEndX} ${humpPeakY} ${humpCtrlOutX} ${gridNode.y} ${humpEndX} ${gridNode.y} ` +
        `L${batteryNode.x} ${batteryNode.y}`
      : `M${gridNode.x} ${gridNode.y} L${batteryNode.x} ${batteryNode.y}`;

    // Grid → PV: right angle (horizontal to center-10, turn up, vertical to PV line)
    const linePvGridD =
      `M${gridNode.x} ${gridPvStartY} ` +
      `H${pvGridEndX - pvGridTurnRadius} ` +
      `Q${pvGridEndX} ${gridPvStartY} ${pvGridEndX} ${gridPvStartY - pvGridTurnRadius} ` +
      `V${pvNode.y}`;

    // PV → Battery: right angle (horizontal from center+10, turn down, vertical to Battery top)
    const linePvBatteryD =
      `M${pvBatteryStartX} ${pvNode.y} ` +
      `H${batteryNode.x - pvGridTurnRadius} ` +
      `Q${batteryNode.x} ${pvNode.y} ${batteryNode.x} ${pvNode.y + pvGridTurnRadius} ` +
      `V${pvBatteryEndY}`;

    // Grid → Home: right angle (vertical down to home line, horizontal to home center-10)
    const lineGridHomeD =
      `M${gridNode.x} ${gridHomeStartY} ` +
      `V${homeNode.y - pvGridTurnRadius} ` +
      `Q${gridNode.x} ${homeNode.y} ${gridNode.x + pvGridTurnRadius} ${homeNode.y} ` +
      `H${gridHomeEndX}`;

    // Battery → Home: right angle (vertical down to home line, horizontal to home center+10)
    const lineHomeBatteryD =
      `M${batteryNode.x} ${batteryHomeStartY} ` +
      `V${homeNode.y - pvGridTurnRadius} ` +
      `Q${batteryNode.x} ${homeNode.y} ${batteryNode.x - pvGridTurnRadius} ${homeNode.y} ` +
      `H${batteryHomeEndX}`;

    const hostClasses = [
      !hasPv ? "no-pv" : "",
      !hasBattery ? "no-battery" : "",
      pvInBatterySlot ? "pv-as-battery" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const cardClass = [
      hideCardBg ? "transparent" : "",
      !hasPv ? "no-pv" : "",
      !hasBattery ? "no-battery" : "",
      pvInBatterySlot ? "pv-as-battery" : "",
      this._layoutReady ? "layout-ready" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const batteryRenderList = batteryItems.map((item, idx) => {
      const cfg = item.cfg || {};
      const socVal = this._getBatterySocValue(cfg);
      const socEntity = this._getBatterySocEntity(cfg);
      const socIcon = this._getBatteryIcon(socVal);

      const isChargeDischarge = Boolean(cfg?.charge_entity || cfg?.discharge_entity || cfg?.chargeEntity || cfg?.dischargeEntity);
      const chgRaw = cfg?.charge_entity || cfg?.chargeEntity ? this._getNumericMaybe(cfg.charge_entity || cfg.chargeEntity) : null;
      const disRaw = cfg?.discharge_entity || cfg?.dischargeEntity ? this._getNumericMaybe(cfg.discharge_entity || cfg.dischargeEntity) : null;

      const entityId =
        cfg.entity ||
        cfg.charge_entity ||
        cfg.chargeEntity ||
        cfg.discharge_entity ||
        cfg.dischargeEntity ||
        socEntity ||
        null;

      const decimals = this._getDecimalPlaces(cfg);
      const unitOverride = this._getUnitOverride(cfg);

      let valStr = "";
      if (isChargeDischarge && chgRaw != null && disRaw != null) {
        const chgVal = this._formatPowerWithOverride(Math.abs(this._toWatts(chgRaw, item.unit)), decimals, item.unit, unitOverride);
        const disVal = this._formatPowerWithOverride(Math.abs(this._toWatts(disRaw, item.unit)), decimals, item.unit, unitOverride);
        valStr = `${chgVal} / ${disVal}`;
      } else {
        const magW = isChargeDischarge
          ? Math.abs(item.watts)
          : Math.abs(this._toWatts(item.value, item.unit));
        valStr = this._formatPowerWithOverride(
          magW,
          decimals,
          item.unit,
          unitOverride
        );
      }

      const showSoc = this._coerceBoolean(cfg.show_soc, true);
      const socStr =
        showSoc && Number.isFinite(socVal) ? `${Math.round(socVal)}%` : "";

      const thr = this._toWatts(this._parseThreshold(cfg.threshold), "W", true);
      const opacity = this._opacityFor(item.watts, thr);
      const bColor = cfg.color || batteryColor;

      return {
        cfg,
        entityId,
        valStr,
        socStr,
        socIcon,
        opacity,
        color: bColor,
        idx,
      };
    });

    const isSingleBattery = batteryRenderList.length === 1;
    const singleBat = isSingleBattery ? batteryRenderList[0] : null;

    const pvMdiPath = this._getMdiPath(pvIcon);
    const gridMdiPath = this._getMdiPath(gridIcon);
    const homeMdiPath = this._getMdiPath(homeIcon);
    const batIconToUse = singleBat ? singleBat.cfg.icon || singleBat.socIcon : "mdi:battery-high";
    const batMdiPath = this._getMdiPath(batIconToUse);

    return compactPowerCardHtml`
      <ha-card class=${cardClass}>
        <div id="icon-probe" style="display:none;"></div>
        <div class="canvas">
          <svg
            viewBox=${`0 0 ${baseWidth}${viewHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="home-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop id="home-stop-1" offset="0%" stop-color=${homeColor} />
                <stop id="home-stop-2" offset="100%" stop-color=${homeColor} />
                <stop id="home-stop-3" offset="100%" stop-color=${homeColor} />
                <stop id="home-stop-4" offset="100%" stop-color=${homeColor} />
                <stop id="home-stop-5" offset="100%" stop-color=${homeColor} />
                <stop id="home-stop-6" offset="100%" stop-color=${homeColor} />
              </linearGradient>
            </defs>

            <!-- Flow lines -->
            <g id="flow-lines">
              <path id="line-pv-grid" class="flow-line" d=${linePvGridD} />
              <line
                id="line-pv-home"
                class="flow-line"
                x1=${pvNode.x}
                y1=${pvNode.y}
                x2=${homeNode.x}
                y2=${homeNode.y}
              />
              <path id="line-pv-battery" class="flow-line" d=${linePvBatteryD} />
              <path id="line-grid-home" class="flow-line" d=${lineGridHomeD} />
              <path id="line-home-battery" class="flow-line" d=${lineHomeBatteryD} />
              <path id="arc-grid-battery" class="flow-line" fill="none" d=${arcGridBatteryD} />
            </g>

            <!-- Dynamic Device Power Lines -->
            <g id="device-lines"></g>

            <!-- Flow dots -->
            <g id="flow-dots">
              <circle
                id="dot-pv-home"
                r="3"
                fill=${pvColor}
                opacity="0"
                cx="50%"
                cy=${pvNode.y}
              />
              <circle
                id="dot-pv-battery"
                r="3"
                fill=${pvColor}
                opacity="0"
                cx=${pvNode.x}
                cy=${pvNode.y}
              />
              <circle
                id="dot-pv-grid"
                r="3"
                fill=${pvColor}
                opacity="0"
                cx=${pvNode.x}
                cy=${pvNode.y}
              />
              <circle
                id="dot-grid-home"
                r="3"
                fill=${gridColor}
                opacity="0"
                cx=${gridNode.x}
                cy=${gridNode.y}
              />
              <circle
                id="dot-grid-battery"
                r="3"
                fill=${gridColor}
                opacity="0"
                cx=${gridNode.x}
                cy=${gridNode.y}
              />
              <circle
                id="dot-battery-home"
                r="3"
                fill=${batteryColor}
                opacity="0"
                cx=${batteryNode.x}
                cy=${batteryNode.y}
              />
              <circle
                id="dot-battery-grid"
                r="3"
                fill=${batteryColor}
                opacity="0"
                cx=${batteryNode.x}
                cy=${batteryNode.y}
              />
            </g>
          </svg>

          <!-- HTML Overlay Items -->
          <div class="overlay">

            <!-- PV Section -->
            ${hasPv
              ? compactPowerCardHtml`
                  <div
                    class="overlay-item pv-section"
                    style=${`left: ${pvNode.x}px; top: ${pvNode.y}px;`}
                  >
                    <div
                      class="node-marker pv-marker clickable"
                      title=${pvCfg.entity || "PV"}
                      @click=${() => this._handleLabelClick(pvCfg, pvCfg.entity)}
                    >
                      <div class=${`pv-icon-wrap${pvMdiPath ? " custom" : ""}`}>
                        <div
                          class="pv-icon-circle"
                          style=${`border-color: ${pvColor}; opacity: ${pvOpacity}; filter: ${pvShadow};`}
                        ></div>
                        ${pvMdiPath
                          ? compactPowerCardHtml`
                              <svg class="pv-icon" viewBox="0 0 24 24" style=${`fill: ${pvColor}; opacity:${pvOpacity};`}>
                                <path d=${pvMdiPath}></path>
                              </svg>
                            `
                          : compactPowerCardHtml`
                              <ha-icon
                                class="pv-icon"
                                icon=${pvIcon}
                                style=${`color: ${pvColor}; opacity:${pvOpacity};`}
                              ></ha-icon>
                            `}
                      </div>

                      <div class="node-label">
                        <span
                          class="value-number"
                          style=${`opacity: ${pvOpacity};`}
                        >
                          ${pvDisplayVal}
                        </span>
                      </div>
                    </div>
                  </div>
                `
              : ""}

            <!-- Grid Section -->
            <div
              class="overlay-item grid-section anchor-left"
              style=${`left: ${gridNode.x}px; top:${gridNode.y}px;`}
            >
              <div
                class="node-marker left grid-marker clickable"
                title=${gridCfg.entity || "Grid"}
                @click=${() => this._handleLabelClick(gridCfg, gridCfg.entity)}
              >
                <div class=${`grid-icon-wrap${gridMdiPath ? " custom" : ""}`}>
                  <div
                    class="grid-icon-circle"
                    style=${`border-color: ${gridColor}; opacity: ${gridOpacity}; filter:${gridShadow};`}
                  ></div>
                  ${gridMdiPath
                    ? compactPowerCardHtml`
                        <svg class="grid-icon" viewBox="0 0 24 24" style=${`fill: ${gridColor}; opacity: ${gridOpacity};`}>
                          <path d=${gridMdiPath}></path>
                        </svg>
                      `
                    : compactPowerCardHtml`
                        <ha-icon
                          class="grid-icon"
                          icon=${gridIcon}
                          style=${`color: ${gridColor}; opacity: ${gridOpacity};`}
                        ></ha-icon>
                      `}
                </div>

                <div class="node-label left">
                  <span
                    class="value-number"
                    style=${`opacity: ${gridOpacity};`}
                  >
                    ${gridDisplayVal}
                  </span>
                </div>
              </div>
            </div>

            <!-- Battery Section -->
            <div
              class="overlay-item battery-section anchor-right"
              style=${`left: ${batteryNode.x}px; top:${batteryNode.y}px;`}
            >
              <div class="node-marker right battery-marker">
                <div class=${`battery-icon-wrap${batMdiPath ? " custom" : ""}`}>
                  <div
                    class="battery-icon-circle"
                    style=${`border-color: ${batteryColor}; opacity: ${                       singleBat ? singleBat.opacity : 1                     }; filter: ${
                      allowGlow && (!singleBat || singleBat.opacity >= 1)
                        ? `drop-shadow(0 0 6px ${batteryColor})`
                        : "none"
                    };`}
                  ></div>
                  ${batMdiPath
                    ? compactPowerCardHtml`
                        <svg class="battery-icon" viewBox="0 0 24 24" style=${`fill: ${batteryColor}; opacity: ${
                          singleBat ? singleBat.opacity : 1
                        };`}>
                          <path d=${batMdiPath}></path>
                        </svg>
                      `
                    : compactPowerCardHtml`
                        <ha-icon
                          class="battery-icon"
                          icon=${batIconToUse}
                          style=${`color: ${batteryColor}; opacity: ${
                            singleBat ? singleBat.opacity : 1
                          };`}
                        ></ha-icon>
                      `}
                </div>

                ${isSingleBattery
                  ? compactPowerCardHtml`
                      <div
                        class="node-label right clickable"
                        title=${singleBat.entityId || "Battery"}
                        @click=${() =>
                          this._handleLabelClick(singleBat.cfg, singleBat.entityId)}
                      >
                        <span
                          class="value-number"
                          style=${`opacity: ${singleBat.opacity};`}
                        >
                          ${singleBat.valStr}
                        </span>
                        ${singleBat.socStr
                          ? compactPowerCardHtml`
                              <span
                                class="value-unit"
                                style=${`opacity: ${singleBat.opacity};`}
                              >
                                (${singleBat.socStr})
                              </span>
                            `
                          : ""}
                      </div>
                    `
                  : compactPowerCardHtml`
                      <div class="battery-multi">
                        ${batteryRenderList.map(
                          (b) => compactPowerCardHtml`
                            <div
                              class="battery-multi-item clickable"
                              title=${b.entityId || "Battery"}
                              @click=${() =>
                                this._handleLabelClick(b.cfg, b.entityId)}
                              style=${`opacity: ${b.opacity};`}
                            >
                              <span class="value-number">${b.valStr}</span>
                              ${b.socStr
                                ? compactPowerCardHtml`<span class="value-unit">(${b.socStr})</span>`
                                : ""}
                            </div>
                          `
                        )}
                      </div>
                    `}
              </div>
            </div>

            <!-- Home Section -->
            <div
              class="overlay-item home-section"
              style=${`left: ${homeNode.x}px; top:${homeNode.y}px;`}
            >
              <div
                class="home-marker clickable"
                title=${homeCfg.entity || "Home"}
                @click=${() => this._handleLabelClick(homeCfg, homeCfg.entity)}
              >
                <div class=${`home-icon-wrap${homeMdiPath ? " custom" : ""}`}>
                  <div
                    class="home-icon-circle"
                    style=${`border-color: ${homeColor}; opacity: ${homeOpacity}; filter:${homeShadow};`}
                  ></div>
                  ${homeMdiPath
                    ? compactPowerCardHtml`
                        <svg class="home-icon" viewBox="0 0 24 24" style=${`fill: ${homeColor}; opacity: ${homeOpacity};`}>
                          <path d=${homeMdiPath}></path>
                        </svg>
                      `
                    : compactPowerCardHtml`
                        <ha-icon
                          class="home-icon"
                          icon=${homeIcon}
                          style=${`color: ${homeColor}; opacity: ${homeOpacity};`}
                        ></ha-icon>
                      `}
                </div>

                <div class="home-label" style=${`opacity: ${homeOpacity};`}>
                  ${homeDisplayVal}
                </div>
              </div>
            </div>

            <!-- PV Labels (top-left near PV) -->
            ${hasPv && pvLabels.length
              ? compactPowerCardHtml`
                  <div
                    class="overlay-item pv-label-marker anchor-right"
                    style=${`left: ${pvNode.x - 24}px; top: ${pvNode.y}px;`}
                  >
                    ${this._renderLabels(pvLabels, "left", "pv")}
                  </div>
                `
              : ""}

            <!-- Grid Labels (above Grid icon, aligned left) -->
            ${gridLabels.length
              ? compactPowerCardHtml`
                  <div
                    class="overlay-item grid-label-marker anchor-left"
                    style=${`left: ${gridNode.x}px; top: ${gridNode.y - 32}px;`}
                  >
                    ${this._renderLabels(gridLabels, "left", "grid")}
                  </div>
                `
              : ""}

            <!-- Battery Labels (above Battery icon, aligned right) -->
            ${batteryLabels.length
              ? compactPowerCardHtml`
                  <div
                    class="overlay-item battery-label-marker anchor-right"
                    style=${`left: ${batteryNode.x}px; top: ${batteryNode.y - 32}px;`}
                  >
                    ${this._renderLabels(batteryLabels, "right", "battery")}
                  </div>
                `
              : ""}

            <!-- Devices Overlay -->
            ${devicesOverlay}

          </div>
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get("compact-power-card")) {
  customElements.define("compact-power-card", CompactPowerCard);
}
