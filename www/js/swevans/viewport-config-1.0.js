/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2004 Spencer Evans, NAUT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @version     1.0
 * @copyright   Copyright © 2015 Spencer Evans
 * @author		Spencer Evans	evans.spencer@gmail.com
 * @license     http://opensource.org/licenses/MIT
 * @website     http://spencer-evans.com/
 */
var swevans;
(function (swevans) {
    /**
     * A static class for reading and manipulating the settings of the viewport meta tag.
     *
     * Note that if more than one viewport meta tag is included in the html file, the tag
     * appearing last (closer to the end of the document) will be accessed / manipulated.
     *
     * Note that this class does not attempt to read the 'current' viewport scale. We cannot
     * reliably do so because the user scalable, zoom properties, or scrollbar measuring method
     * of the users web view could throw off the reading.
     *
     * Note that the viewport meta tag is not W3C standard. The future of viewport support is leaning
     * in the direction of using '@viewport' css rules to control the viewport configuration. This
     * CSS rule is still not widely supported. The only known implementation is in IE10.
     *
     * RECOMMENDATIONS:
     *	- Specify a single viewport meta tag at the top of your html files
     *	- It is usually best to omit width, height, and target-densitydpi properties.
     *	- The Accessibility Project recommends allowing user-scalable, be sure to manage your max and min scale appropriately.
     *	- An example ideal viewport meta tag is:
     *	  <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=3.0, minimum-scale=0.1" />
     *
     * KNOWN ISSUE: There is a known limitation that the viewport class rounds all numerical values to four
     * decimal places, this is to avoid issues when converting numbers to and from strings.
     *
     * KNOWN ISSUE: The userScalable property may not behave exactly as expected. On some devices pages won't
     * actually become scalable until they are too large to fit on the users screen, no matter what the
     * userScalable setting is set to. They may also become scalable regardless of the userScalable setting on
     * some pages. These issues are mostly linked to android devices. This issue is systemic beyond this library.
     *
     * KNOWN ISSUE: Viewport configuration might not even apply in some browsers (mostly desktop and IE10+).
     *
     * BROWSWER SUPPORT:
     * 	- The ViewportConfig class should work in all modern browsers (IE9+).
     *  - The viewport tag itself may not be as widely supported, and thus ViewportConfig changes would have no effect.
     *
     * FUTURE CHANGES:
     *	- It would be nice to support the '@viewport' CSS rules in addition to the meta tag.
     *	- In an ideal world we could figure out the current viewport scale
     */
    var ViewportConfig = (function () {
        //}
        //{ Static Class
        /**
         * Static class 'constructor' that throws an error if you try to create it.
         * @static Do not attempt to instantiate.
         * @private Do not call
         */
        function ViewportConfig() {
            throw new Error("ViewportConfig is a static class! Do not attempt to instantiate!");
        }
        Object.defineProperty(ViewportConfig, "initialScale", {
            //{ Properties
            /** Gets the initial-scale of the viewport. */
            get: function () { return Math.round(parseFloat(this.readContentObj()["initial-scale"]) * 1000) / 1000; },
            /** Sets the initial-scale of the viewport. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("initial-scale", Math.round(value * 1000) / 1000); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "maximumScale", {
            /** Gets the maximum-scale of the viewport. */
            get: function () { return Math.round(parseFloat(this.readContentObj()["maximum-scale"]) * 1000) / 1000; },
            /** Sets the maximum-scale of the viewport. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("maximum-scale", Math.round(value * 1000) / 1000); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "minimumScale", {
            /** Gets the minimum-scale of the viewport. */
            get: function () { return Math.round(parseFloat(this.readContentObj()["minimum-scale"]) * 1000) / 1000; },
            /** Sets the minimum-scale of the viewport. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("minimum-scale", Math.round(value * 1000) / 1000); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "userScalable", {
            /** Gets the user-scalable property of the viewport as a boolean. */
            get: function () { return (this.readContentObj()["user-scalable"] === "yes" ? true : false); },
            /** Sets the user-scalable property of the viewport as a boolean. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("user-scalable", (value ? "yes" : "no")); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "width", {
            /** Gets the width property of the viewport as a string. */
            get: function () { return this.readContentObj()["width"]; },
            /** Sets the width property of the viewport as a string. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("width", value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "height", {
            /** Gets the height property of the viewport as a string. */
            get: function () { return this.readContentObj()["height"]; },
            /** Sets the height property of the viewport as a string. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("height", value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "targetDensityDPI", {
            /** Gets the target-densitydpi property of the viewport as a string. */
            get: function () { return this.readContentObj()["target-densitydpi"]; },
            /** Sets the target-densitydpi property of the viewport as a string. Setting to undefined or null will clear the property from the tag. */
            set: function (value) { this.writeContentObjProp("target-densitydpi", value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "pixelRatioScale", {
            /** Gets the required viewport scale to make css pixel's match hardware pixels. */
            get: function () { return 1 / (window.devicePixelRatio ? window.devicePixelRatio : 1); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewportConfig, "isSupported", {
            /** Gets a boolean indicating if the viewport tag is supported on the current device. True if the pixel ratio != 1 */
            get: function () { return (this.pixelRatioScale !== 1 ? true : false); },
            enumerable: true,
            configurable: true
        });
        //}
        //{ Read / Write
        /**
         * Reads all properties of the viewport content tag into an object and returns it.
         * @return An object containing all the viewport tag content properties. An empty object if the tag or the content attribute is not defined.
         * @private Do not call
         */
        ViewportConfig.readContentObj = function () {
            // Create an empty content object to fill
            var contentObj = new Object();
            // Get the viewport tag
            var viewports = document.querySelectorAll("meta[name=viewport]");
            var viewport = null;
            if (viewports.length > 0)
                viewport = viewports[viewports.length - 1];
            if (viewport === null)
                return contentObj; // If no viewport tag, then return the empty object
            // Get the content property of the viewport tag
            var contentValue = viewport.content;
            if (contentValue === "" || contentValue === null)
                return contentObj; // If no content prop, then return the empty object
            // Split the content property into a set of values
            var contentValues = contentValue.split(",");
            // Populate the content object properties
            for (var i = 0; i < contentValues.length; ++i) {
                var val = contentValues[i];
                // Remove white space
                while (val.indexOf(" ") >= 0)
                    val = val.replace(" ", "");
                // Split prop and value
                var parts = val.split("=");
                var prop = parts[0];
                var value = parts[1];
                // Assign to the content obj
                contentObj[prop] = value;
            }
            return contentObj;
        };
        /**
         * Writes a property and value to the content attribute of the viewport tag. If no
         * viewport tag exists, one will be created.
         * @private Do not call
         */
        ViewportConfig.writeContentObjProp = function (prop, value) {
            // Read the current content obj
            var contentObj = this.readContentObj();
            // Set the property
            contentObj[prop] = value;
            // Get the viewport tag, or create it if necessary
            var viewports = document.querySelectorAll("meta[name=viewport]");
            var viewport = null;
            if (viewports.length > 0)
                viewport = viewports[viewports.length - 1];
            var append = false;
            if (viewport === null) {
                viewport = document.createElement("meta");
                append = true;
            }
            // Create the content string
            var contentValue = "";
            for (prop in contentObj) {
                if (contentObj.hasOwnProperty(prop)) {
                    // If the property is undefined or null, just ignore it.
                    value = contentObj[prop];
                    if (typeof (value) === "undefined" || value === null)
                        continue;
                    if (contentValue !== "")
                        contentValue += ", ";
                    contentValue += prop + "=" + value;
                }
            }
            // Set the content string
            viewport.setAttribute("content", contentValue);
            // Add the tag if necessary
            if (append)
                document.getElementsByTagName('head')[0].appendChild(viewport);
        };
        //}
        //{ Utilities
        /**
         * Updates the viewport initial scale such that css pixels will match hardward pixels in 1:1 ratio.
         */
        ViewportConfig.matchDevice = function () { this.initialScale = this.pixelRatioScale; };
        return ViewportConfig;
    })();
    swevans.ViewportConfig = ViewportConfig;
})(swevans || (swevans = {}));
