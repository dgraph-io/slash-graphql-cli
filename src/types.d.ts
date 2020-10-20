interface APIBackend {
  url: string;
  jwtToken: string;
  name: string;
  zone: string;
  uid: string;
  owner: string;
}

interface APIKey {
  key: string;
  name: string;
  role: string;
  uid: string;
}

interface AuthConfig {
  apiTime: number;
  access_token: string;
  expires_in: number;
  refresh_token: string;
}
