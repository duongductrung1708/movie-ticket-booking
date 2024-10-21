import {
  pickersTextFieldClasses
} from "./chunk-UIPVYLO5.js";
import "./chunk-62S63ZKW.js";
import {
  Stack_default,
  stackClasses_default
} from "./chunk-KZRBMHE4.js";
import {
  textFieldClasses_default
} from "./chunk-ADPFZRGF.js";
import "./chunk-O3GJBUXK.js";
import "./chunk-3QPUCDWS.js";
import "./chunk-YYEJIEQF.js";
import "./chunk-2T4QLNTE.js";
import "./chunk-JOJBVMY6.js";
import {
  Typography_default
} from "./chunk-AQZWWTC5.js";
import "./chunk-CLVWNPT2.js";
import "./chunk-4DOQE6LS.js";
import "./chunk-QCKRS32G.js";
import "./chunk-LOZHJMDH.js";
import "./chunk-TAPUFPH2.js";
import "./chunk-YQEGK375.js";
import "./chunk-PF2VR3Y5.js";
import "./chunk-JMVEG3FK.js";
import "./chunk-CPX35E4N.js";
import "./chunk-N4IBORE3.js";
import "./chunk-IKIGDCFF.js";
import "./chunk-DAFKOHCM.js";
import "./chunk-HL3HULKC.js";
import "./chunk-5DSGCTKT.js";
import "./chunk-GQD4KS4R.js";
import "./chunk-UHBEHP4Q.js";
import {
  require_jsx_runtime
} from "./chunk-RP37ZT7N.js";
import "./chunk-MCMOV7PY.js";
import {
  _extends
} from "./chunk-HQ6ZTAWL.js";
import "./chunk-2KHBIA62.js";
import {
  require_react
} from "./chunk-TWJRYSII.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@mui/x-date-pickers/internals/demo/DemoContainer.js
var React = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var getChildTypeFromChildName = (childName) => {
  if (childName.match(/^([A-Za-z]+)Range(Calendar|Clock)$/)) {
    return "multi-panel-UI-view";
  }
  if (childName.match(/^([A-Za-z]*)(DigitalClock)$/)) {
    return "Tall-UI-view";
  }
  if (childName.match(/^Static([A-Za-z]+)/) || childName.match(/^([A-Za-z]+)(Calendar|Clock)$/)) {
    return "UI-view";
  }
  if (childName.match(/^MultiInput([A-Za-z]+)RangeField$/) || childName.match(/^([A-Za-z]+)RangePicker$/)) {
    return "multi-input-range-field";
  }
  if (childName.match(/^SingleInput([A-Za-z]+)RangeField$/)) {
    return "single-input-range-field";
  }
  return "single-input-field";
};
var getSupportedSectionFromChildName = (childName) => {
  if (childName.includes("DateTime")) {
    return "date-time";
  }
  if (childName.includes("Date")) {
    return "date";
  }
  return "time";
};
function DemoItem(props) {
  const {
    label,
    children,
    component,
    sx: sxProp
  } = props;
  let spacing;
  let sx = sxProp;
  if (component && getChildTypeFromChildName(component) === "multi-input-range-field") {
    spacing = 1.5;
    sx = _extends({}, sx, {
      [`& .${textFieldClasses_default.root}`]: {
        flexGrow: 1
      }
    });
  } else {
    spacing = 1;
  }
  return (0, import_jsx_runtime.jsxs)(Stack_default, {
    direction: "column",
    alignItems: "stretch",
    spacing,
    sx,
    children: [label && (0, import_jsx_runtime.jsx)(Typography_default, {
      variant: "body2",
      children: label
    }), children]
  });
}
DemoItem.displayName = "DemoItem";
var isDemoItem = (child) => {
  if (React.isValidElement(child) && typeof child.type !== "string") {
    return child.type.displayName === "DemoItem";
  }
  return false;
};
function DemoContainer(props) {
  const {
    children,
    components,
    sx: sxProp
  } = props;
  const childrenTypes = /* @__PURE__ */ new Set();
  const childrenSupportedSections = /* @__PURE__ */ new Set();
  components.forEach((childName) => {
    childrenTypes.add(getChildTypeFromChildName(childName));
    childrenSupportedSections.add(getSupportedSectionFromChildName(childName));
  });
  const getSpacing = (direction2) => {
    if (direction2 === "row") {
      return childrenTypes.has("UI-view") || childrenTypes.has("Tall-UI-view") ? 3 : 2;
    }
    return childrenTypes.has("UI-view") ? 4 : 3;
  };
  let direction;
  let spacing;
  let extraSx = {};
  let demoItemSx = {};
  const sx = _extends({
    overflow: "auto",
    // Add padding as overflow can hide the outline text field label.
    pt: 1
  }, sxProp);
  if (components.length > 2 || childrenTypes.has("multi-input-range-field") || childrenTypes.has("single-input-range-field") || childrenTypes.has("multi-panel-UI-view") || childrenTypes.has("UI-view") || childrenSupportedSections.has("date-time")) {
    direction = "column";
    spacing = getSpacing("column");
  } else {
    direction = {
      xs: "column",
      lg: "row"
    };
    spacing = {
      xs: getSpacing("column"),
      lg: getSpacing("row")
    };
  }
  if (childrenTypes.has("UI-view")) {
  } else if (childrenTypes.has("single-input-range-field")) {
    if (!childrenSupportedSections.has("date-time")) {
      extraSx = {
        [`& > .${textFieldClasses_default.root}, & > .${pickersTextFieldClasses.root}`]: {
          minWidth: 300
        }
      };
    } else {
      extraSx = {
        [`& > .${textFieldClasses_default.root}, & > .${pickersTextFieldClasses.root}`]: {
          minWidth: {
            xs: 300,
            // If demo also contains MultiInputDateTimeRangeField, increase width to avoid cutting off the value.
            md: childrenTypes.has("multi-input-range-field") ? 460 : 400
          }
        }
      };
    }
  } else if (childrenSupportedSections.has("date-time")) {
    extraSx = {
      [`& > .${textFieldClasses_default.root}, & > .${pickersTextFieldClasses.root}`]: {
        minWidth: 270
      }
    };
    if (childrenTypes.has("multi-input-range-field")) {
      demoItemSx = {
        [`& > .${stackClasses_default.root} > .${textFieldClasses_default.root}, & > .${stackClasses_default.root} > .${pickersTextFieldClasses.root}`]: {
          minWidth: 210
        }
      };
    }
  } else {
    extraSx = {
      [`& > .${textFieldClasses_default.root}, & > .${pickersTextFieldClasses.root}`]: {
        minWidth: 200
      }
    };
  }
  const finalSx = _extends({}, sx, extraSx);
  return (0, import_jsx_runtime.jsx)(Stack_default, {
    direction,
    spacing,
    sx: finalSx,
    children: React.Children.map(children, (child) => {
      if (React.isValidElement(child) && isDemoItem(child)) {
        return React.cloneElement(child, {
          sx: _extends({}, extraSx, demoItemSx)
        });
      }
      return child;
    })
  });
}
export {
  DemoContainer,
  DemoItem
};
//# sourceMappingURL=@mui_x-date-pickers_internals_demo.js.map
