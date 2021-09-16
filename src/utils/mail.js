const nodemailer = require('nodemailer')

module.exports = async (token, email) => {
	// let testAccount = await nodemailer.createTestAccount()
	
	// let transporter = nodemailer.createTransport({
	// 	name: 'smtp.ethereal.email',
	// 	host: 'smtp.ethereal.email',
	// 	port: 587,
	// 	secure: false,
	// 	auth: {
	// 		user: testAccount.user,
	// 		pass: testAccount.pass
	// 	}
	// })

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '',
			pass: ''
		},
	})

	let info = await transporter.sendMail({
		from: 'kirb@test.com',
		to: email,
		subject: 'Link To Reset Password',
		text: `Please click the following link or paste this into your browser to complete the process
				http://localhost:3000/reset/${token}`
	})

	console.log(info)
}