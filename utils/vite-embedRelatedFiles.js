
import fs from 'fs';
import path from 'path';

export const embedRelatedFiles = () => {
    return {
        name: 'embed-related-files',
        enforce: 'post',
        transform(code, id) {
            if (id.includes('/components/') && id.endsWith('.js')) {
                const componentName = path.basename(id, '.js');
                const componentDir = path.dirname(id);
                const htmlPath = path.resolve(componentDir, `templates/${componentName}.html`);
                const cssPath = path.resolve(componentDir, `styles/${componentName}.css`);

                // Read the content of the HTML and CSS files
                const htmlContent = fs.existsSync(htmlPath)
                    ? fs.readFileSync(htmlPath, 'utf-8').replace(/`/g, '\\`')
                    : '';
                const cssContent = fs.existsSync(cssPath)
                    ? fs.readFileSync(cssPath, 'utf-8').replace(/`/g, '\\`')
                    : '';
                return {
                    code: code
                        .replace('__HTML__', `\`${htmlContent}\``)
                        .replace('__CSS__', `\`${cssContent}\``),
                    map: null,
                };
            }
            return null;
        },
    };
}