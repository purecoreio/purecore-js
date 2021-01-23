class ColorScheme {

    public dark: boolean;
    public primary: string;
    public secondary: string;
    public accent: string;
    public error: string;

    public static fromObject(object: any): ColorScheme {

        let scheme = new ColorScheme();
        scheme.dark = Boolean(object.dark);
        scheme.primary = String(object.primary);
        scheme.secondary = String(object.secondary);
        scheme.accent = String(object.accent);
        scheme.error = String(object.errorColor);

        return scheme;

    }


}