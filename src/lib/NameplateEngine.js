/**
 * NameplateEngine - Core Designer Logic
 * Calculates safe zones and positions elements without overlap
 */
class NameplateEngine {
    constructor(canvasWidth, canvasHeight, options = {}) {
        const padding = typeof options === 'number' ? options : (options.padding || 58);
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.safeZone = {
            top: padding,
            bottom: canvasHeight - padding,
            left: padding,
            right: canvasWidth - padding,
            center: canvasWidth / 2,
            middle: canvasHeight / 2,
            width: canvasWidth - (padding * 2),
            height: canvasHeight - (padding * 2)
        };
    }

    /**
     * Builds a vertically-balanced layout stack inside the safe zone.
     * The returned boxes are used by Fabric renderers to avoid overlap.
     */
    getLayoutPlan({ logoCount = 0, hasSubText = true, hasFooterText = false } = {}) {
        const width = this.safeZone.width;
        const centerX = this.safeZone.center;
        const hasLogo = logoCount > 0;

        const logoHeight = hasLogo ? Math.min(70, this.safeZone.height * 0.2) : 0;
        const logoGap = hasLogo ? 20 : 0;
        const nameHeight = Math.min(132, this.safeZone.height * 0.36);
        const subHeight = hasSubText ? Math.min(54, this.safeZone.height * 0.16) : 0;
        const footerHeight = hasFooterText ? Math.min(36, this.safeZone.height * 0.11) : 0;
        const subGap = hasSubText ? 10 : 0;
        const footerGap = hasFooterText ? 8 : 0;

        const stackHeight = logoHeight + logoGap + nameHeight + subGap + subHeight + footerGap + footerHeight;
        let top = this.safeZone.top + Math.max(8, (this.safeZone.height - stackHeight) / 2);

        const boxes = {};
        if (hasLogo) {
            boxes.logo = this.box(centerX, top, Math.min(width * 0.56, 300), logoHeight);
            top += logoHeight + logoGap;
        }

        boxes.name = this.box(centerX, top, width, nameHeight);
        top += nameHeight;

        if (hasSubText) {
            top += subGap;
            boxes.sub = this.box(centerX, top, width * 0.9, subHeight);
            top += subHeight;
        }

        if (hasFooterText) {
            top += footerGap;
            boxes.footer = this.box(centerX, top, width * 0.8, footerHeight);
        }

        return boxes;
    }

    /**
     * Returns a Fabric-friendly bounding box.
     */
    box(centerX, top, width, height) {
        return {
            left: centerX - (width / 2),
            top,
            width,
            height,
            centerX,
            centerY: top + (height / 2)
        };
    }

    /**
     * Fits an existing Fabric text object into a box by reducing font size.
     */
    fitTextObject(textObject, box, { maxFontSize = 90, minFontSize = 16 } = {}) {
        let size = maxFontSize;
        textObject.set({ fontSize: size, scaleX: 1, scaleY: 1 });

        while (size > minFontSize && (textObject.width > box.width || textObject.height > box.height)) {
            size -= 2;
            textObject.set({ fontSize: size });
            textObject.initDimensions();
        }

        if (textObject.width > box.width) {
            textObject.scaleToWidth(box.width);
        }

        if (textObject.getScaledHeight() > box.height) {
            textObject.scaleToHeight(box.height);
        }

        textObject.set({
            left: box.centerX,
            top: box.centerY,
            originX: 'center',
            originY: 'center'
        });

        return size;
    }
}

export default NameplateEngine;
