export interface User {
  user_id: string
  name: string
  role: string
  token: string
}

export interface LoginFrom {
  username: string
  password: string
}

export interface RegisterFrom {
  username: string
  password: string
  confirmPassword: string
}
