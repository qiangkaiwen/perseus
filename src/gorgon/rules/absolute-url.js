import Rule from "../rule.js";
import {getHostname} from "./lint-utils.js";

module.exports = Rule.makeRule({
    name: "absolute-url",
    selector: "link, image",
    lint: function(state, content, nodes, match) {
        const url = nodes[0].target;
        const hostname = getHostname(url);

        if (
            hostname === "khanacademy.org" ||
            hostname.endsWith(".khanacademy.org")
        ) {
            return `Don't use absolute URLs:
When linking to KA content or images, omit the
https://www.khanacademy.org URL prefix.
Use a relative URL beginning with / instead.`;
        }
    },
});
