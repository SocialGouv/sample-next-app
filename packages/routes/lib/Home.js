"use strict";
//
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const head_1 = tslib_1.__importDefault(require("next/head"));
//
class HomeRoute extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(head_1.default, null,
                react_1.default.createElement("title", null, "Sample Next App")),
            react_1.default.createElement("h1", null, "Hello from @sample-next-app/routes"),
            react_1.default.createElement("a", { href: "/about" }, "About page"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("a", { href: "/noise" }, "Noise page")));
    }
}
exports.HomeRoute = HomeRoute;
//# sourceMappingURL=Home.js.map