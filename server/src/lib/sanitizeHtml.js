const sanitizeHtml = require("sanitize-html");

function sanitizeContent(html) {
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "figure", "figcaption",
            "pre", "code",
            "table", "thead", "tbody", "tfoot", "tr", "th", "td",
            "blockquote",
            "span",
        ]),
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            "*": ["style", "class"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        allowedSchemesByTag: {
            img: ["http", "https"],
        },
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", {
                rel: "noopener noreferrer",
                target: "_blank",
            }),
        },
    });
}

module.exports = sanitizeContent;
