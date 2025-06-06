const version = "v1"

const GET = "GET"
const POST = "POST"
const PUT = "PUT"
const DELETE = "DELETE"
const PATCH = "PATCH"

const routes = {
	auth: {
		login: `api/${version}/auth/login`,
		register: `api/${version}/auth/register`,
		sendOtp: `api/${version}/auth/send-otp`,
		verifyOtp: `api/${version}/auth/verify-otp`,
		updateForgetPass: `api/${version}/auth/update-forget-pass`,
		logout: `api/${version}/auth/logout`,
	},
	category: `api/${version}/category`,
	tags: `api/${version}/tags`,
	user: {
		update: `api/${version}/user`,
		profile: `api/${version}/user/profile`,
	},
	blog: {
		admin: `api/${version}/blog/admin`,
		blog: `api/${version}/blog`,
	},
	dashboard: {
		admin: `api/${version}/dashboard/admin`,
		user: `api/${version}/dashboard/user`,
	}
}


export {
	GET,
	POST,
	PUT,
	DELETE,
	PATCH,
	routes
}