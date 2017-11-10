export function loadImage(src, flipY) {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const p = new Promise((resolve, reject) => {
        try {
            img.onload = () => {
                const width = img.width;
                const height = img.height;

                canvas.width = width;
                canvas.height = height;

                if (flipY) {
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                }
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, width, height);
                resolve(imageData);
            };
            img.src = src;
        } catch (err) {
            reject(err);
        }
    });
    return p;
}
