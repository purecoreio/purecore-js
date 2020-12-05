class Util {

    public static date(UTCSeconds: number): Date {
        let date = new Date(0);
        date.setUTCSeconds(UTCSeconds);
        return date;
    }

}