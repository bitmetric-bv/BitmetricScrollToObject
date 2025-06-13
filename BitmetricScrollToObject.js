define(["jquery", "qlik"], function ($, qlik) {
  return {
    definition: {
      type: "items",
      component: "accordion",
      items: {
        scrollSettings: {
          label: "Scroll settings",
          type: "items",
          items: {
            scrollTarget: {
              ref: "props.scrollTarget",
              label: "Scroll target",
              type: "string",
              component: "dropdown",
              defaultValue: "object",
              options: [
                { value: "object", label: "Scroll to object" },
                { value: "top", label: "Scroll to top" }
              ]
            },
            objectId: {
              ref: "props.targetId",
              label: "Target object",
              type: "string",
              component: "dropdown",
              show: function (data) {
                return data.props.scrollTarget === "object";
              },
              options: function () {
                return new Promise(function (resolve) {
                  const app = qlik.currApp();
                  const currentSheetId = qlik.navigation.getCurrentSheetId().sheetId;

                  app.getObjectProperties(currentSheetId).then(sheetProps => {
                    const cells = sheetProps.properties.cells || [];

                    const promises = cells.map(cell =>
                      app.getObjectProperties(cell.name).then(objProps => {
                        const title = objProps.properties.title || "(No title)";
                        const type = objProps.properties.visualization || "Unknown";
                        return {
                          value: cell.name,
                          label: `${title} (${type}, ${cell.name})`
                        };
                      })
                    );

                    Promise.all(promises).then(results => resolve(results));
                  });
                });
              }
            },
            scrollBehavior: {
              ref: "props.scrollBehavior",
              label: "Scroll type",
              type: "string",
              component: "dropdown",
              defaultValue: "smooth",
              options: [
                { value: "smooth", label: "Smooth" },
                { value: "auto", label: "Jump (no animation)" }
              ]
            }
          }
        },
        buttonSettings: {
          label: "Button settings",
          type: "items",
          items: {
            buttonLabel: {
              ref: "props.buttonLabel",
              label: "Button label",
              type: "string",
              defaultValue: "▼ Scroll to object"
            },
            textStyle: {
              label: "Text style",
              type: "items",
              items: {
                textFontFamily: {
                  ref: "props.textFontFamily",
                  label: "Font family",
                  type: "string",
                  component: "dropdown",
                  defaultValue: "QlikView Sans, sans-serif",
                  options: [
                    { value: "QlikView Sans, sans-serif", label: "QlikView Sans" },
                    { value: "Arial, sans-serif", label: "Arial" },
                    { value: "Tahoma, sans-serif", label: "Tahoma" },
                    { value: "Verdana, sans-serif", label: "Verdana" },
                    { value: "Courier New, monospace", label: "Courier New" },
                    { value: "Poppins", label: "Poppins" },
                    { value: "Source Sans Pro", label: "Source Sans Pro" },
                    { value: "Lora", label: "Lora" }
                  ]
                },
                fontSize: {
                  ref: "props.fontSize",
                  label: "Font size (px)",
                  type: "number",
                  defaultValue: 14
                },
                textColor: {
                  ref: "props.textColor",
                  label: "Text color",
                  type: "object",
                  component: "color-picker",
                  defaultValue: {
                    color: "#ffffff"
                  }
                },
                textBold: {
                  ref: "props.textBold",
                  label: "Bold",
                  type: "boolean",
                  component: "checkbox",
                  defaultValue: false
                },
                textItalic: {
                  ref: "props.textItalic",
                  label: "Italic",
                  type: "boolean",
                  component: "checkbox",
                  defaultValue: false
                },
                textUnderline: {
                  ref: "props.textUnderline",
                  label: "Underline",
                  type: "boolean",
                  component: "checkbox",
                  defaultValue: false
                }
              }
            },
            buttonColor: {
              ref: "props.buttonColor",
              label: "Background color",
              type: "object",
              component: "color-picker",
              defaultValue: {
                color: "#2d2e83"
              }
            },
            buttonWidth: {
              ref: "props.buttonWidth",
              label: "Button width",
              type: "string",
              component: "dropdown",
              defaultValue: "auto",
              options: [
                { value: "auto", label: "Auto" },
                { value: "100%", label: "Full width" },
                { value: "fixed", label: "Fixed" }
              ]
            },
            fixedButtonWidth: {
              ref: "props.fixedButtonWidth",
              label: "Fixed width (px)",
              type: "number",
              defaultValue: 150,
              show: function (data) {
                return data.props.buttonWidth === "fixed";
              }
            },
            buttonAlign: {
              ref: "props.buttonAlign",
              label: "Button alignment",
              type: "string",
              component: "dropdown",
              defaultValue: "center",
              options: [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" }
              ]
            },
            buttonVerticalAlign: {
              ref: "props.buttonVerticalAlign",
              label: "Vertical alignment",
              type: "string",
              component: "dropdown",
              defaultValue: "middle",
              options: [
                { value: "top", label: "Top" },
                { value: "middle", label: "Middle" },
                { value: "bottom", label: "Bottom" }
              ]
            },
            borderColor: {
              ref: "props.borderColor",
              label: "Border color",
              type: "object",
              component: "color-picker",
              defaultValue: {
                color: "#2d2e83"
              }
            },
            borderWidth: {
              ref: "props.borderWidth",
              label: "Border width (px)",
              type: "number",
              defaultValue: 1
            },
            borderStyle: {
              ref: "props.borderStyle",
              label: "Border style",
              type: "string",
              component: "dropdown",
              defaultValue: "solid",
              options: [
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
                { value: "none", label: "None" }
              ]
            },
            borderRadius: {
              ref: "props.borderRadius",
              label: "Corner radius (px)",
              type: "number",
              defaultValue: 0
            }
          }
        },
        addons: {
          uses: "addons"
        },
        appearance: {
          uses: "settings"
        }
      }
    },

    paint: function ($element, layout) {
      const {
        targetId,
        buttonLabel,
        scrollTarget,
        scrollBehavior,
        fontSize,
        buttonWidth,
        fixedButtonWidth,
        buttonAlign,
        buttonVerticalAlign,
        borderWidth,
        borderStyle,
        borderRadius
      } = layout.props;

      const buttonColor = layout.props.buttonColor?.color || "#2d2e83";
      const textColor = layout.props.textColor?.color || "#ffffff";
      const borderColor = layout.props.borderColor?.color || "#2d2e83";

      const btnId = layout.qInfo.qId + "_scrollBtn";

      const widthStyle = buttonWidth === "100%"
        ? "100%"
        : (buttonWidth === "fixed" ? `${fixedButtonWidth || 150}px` : "auto");

      const fontFamily = layout.props.textFontFamily || "QlikView Sans, sans-serif";
      const fontWeight = layout.props.textBold ? "bold" : "normal";
      const fontStyle = layout.props.textItalic ? "italic" : "normal";
      const textDecoration = layout.props.textUnderline ? "underline" : "none";

      const justifyContent = buttonAlign === "center" ? "center" : buttonAlign === "right" ? "flex-end" : "flex-start";
      const alignItems = buttonVerticalAlign === "middle" ? "center" : buttonVerticalAlign === "bottom" ? "flex-end" : "flex-start";

      const isEditMode = qlik.navigation && typeof qlik.navigation.getMode === "function" && qlik.navigation.getMode() === "edit";
      const disabledAttr = isEditMode ? "disabled" : "";
      const cursorStyle = isEditMode ? "not-allowed" : "pointer";

      const style = `
        background-color: ${buttonColor};
        color: ${textColor};
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        text-decoration: ${textDecoration};
        padding: 6px 12px;
        width: ${widthStyle};
        border: ${borderWidth}px ${borderStyle} ${borderColor};
        border-radius: ${borderRadius}px;
        cursor: ${cursorStyle};
        transition: transform 0.2s ease-in-out;
      `;

      $element.html(`
        <style>
          #${btnId}:hover:not(:disabled) {
            transform: scale(1.05);
          }
        </style>
        <div style="display: flex; justify-content: ${justifyContent}; align-items: ${alignItems}; height: 100%;">
          <button id="${btnId}" ${disabledAttr} style="${style}">
            ${buttonLabel || "Scroll"}
          </button>
        </div>
      `);

      $(`#${btnId}`).off("click").on("click", function () {
        if (isEditMode) return;

        if (scrollTarget === "top") {
          const scrollContainer = document.querySelector(".qv-panel-sheet");
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: scrollBehavior });
          } else {
            console.warn("Scroll container not found.");
          }
        } else if (targetId) {
          const scrollId = targetId + "_title";
          const el = document.getElementById(scrollId) || document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: scrollBehavior, block: "start" });
          } else {
            console.warn(`Element with ID '${scrollId}' not found.`);
          }
        }
      });

      return qlik.Promise.resolve();
    }
  };
});
