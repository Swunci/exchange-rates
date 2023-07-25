import { JwtPayload } from "jsonwebtoken";

declare module 'Express' {
	export interface Request {
		user?: JwtPayload
	}
}

declare module 'jsonwebtoken' {
	export interface JwtPayload {
		id?: string
	}
}