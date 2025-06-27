export default class ENV {
  public static TEST_ENV = process.env.TEST_ENV; //Example
  public static BASE_URL = process.env.BASE_URL; //Example
  public static BRANCH = process.env.BRANCH; //Example
  public static DOMAIN = this.BASE_URL + (this.BRANCH === ''?'' : '${this. BRANCH}/'); //Example
  public static ACCESS_TOKEN = process.env.ACCESS_TOKEN; //Example
  public static GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; //Example
  public static GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; //Example
  public static SVC_USER = process.env.SVC_USER; //Example
  public static ZEPHYR_AUTH_TOKEN = process.env.ZEPHYR_AUTH_TOKEN; //Example
  public static GCP_PROJECT_NAME = '' //Example
}