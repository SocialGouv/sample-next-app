"use strict";
//
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const head_1 = tslib_1.__importDefault(require("next/head"));
//
const ui_1 = require("@sample-next-app/ui");
//
//
class NoiseRoute extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(head_1.default, null,
                react_1.default.createElement("title", null, "Sample Next App - Noise")),
            react_1.default.createElement("h1", null, "Hello from @sample-next-app/ui"),
            "Some noise here",
            react_1.default.createElement(ui_1.Lorem0, null)));
    }
}
exports.NoiseRoute = NoiseRoute;
//# sourceMappingURL=Noise.js.map