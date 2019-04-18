
const Promise = require('bluebird');

const dotenv = require("dotenv").config({ path: '../.env'}); // access .env dotfile settings
const environment = process.env.NODE_ENV;
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const bcrypt = require('bcrypt');
const saltRounds = 10;

/*
''	
''	This file defines the functions used in the User authorization aspect of the app.
''	These functions handle things relevant just to user data.
''	Things such as: registering, logging in, and accessing the user's profile data
''	
*/


const hashPassword = (password) => {
	return bcrypt.hash(password, saltRounds)
}

// this shows useful examples of promise chaining:
// https://gist.github.com/joepie91/4c3a10629a4263a522e3bc4839a28c83

const getUserByEmail = (email) => {
	return Promise.try(() => {
	        return database("users").where({ user_email: email });
    })
}

const createUser = (email, hashed_password) => {
	return Promise.try(() => {
		return database('users')
			.insert([
				{	user_email: email,
					hashed_password: hashed_password,
					user_type: 'general-hasNot-applied',
				}
			])
			.returning('*')
	})
	.then((result) => {
		console.log('createUser result', result)
		console.log('createUser result[0].user_id', result[0].user_id)
		return Promise.try(() => {
			return database('user_profiles')
				.insert([
					{	
						user_id: result[0].user_id,
						user_profile_email: result[0].user_email,
						user_profile_firstName: 'not-yet-completed',
						user_profile_lastName: 'not-yet-completed',
						user_profile_phoneNumber: 'not-yet-completed',
						user_profile_address: 'not-yet-completed',
						user_profile_city: 'not-yet-completed',
						user_profile_state: 'not-yet-completed',
						user_profile_imageFilename: 'not-yet-completed',
						user_profile_resumeFilename: 'not-yet-completed.pdf',
					}
				])
		})
	})



	/* 
	Set profile as incomplete
	{
	user_profile_phoneNumber: 'not-yet-completed',
	user_profile_email: 'not-yet-completed',
	user_profile_address: 'not-yet-completed',
	user_profile_city: 'not-yet-completed',
	user_profile_state: 'not-yet-completed',
	user_profile_imageFilename: 'not-yet-completed',
	user_profile_resumeFilename: 'not-yet-completed',
	}
			 */
}

const checkPasswordForEmail = (password, email)=> {
	return Promise.try(() => {
		return database("users").where({ user_email: email });
	}).then((user)=>{

		console.log('user.length',user.length)
		if (user.length < 1 || user[0] === undefined || password === "") {
			return false
		} else {

			console.log('Found user for the email that was input... Now comparing hashed passwords')
			// console.log('user from user_fns of user lookup is ', user)
			// compare hashed version of the password input via the form
			// with the [looked-up-by-email] user's hashed password

			return Promise.try(() => {
				return bcrypt.compare(password, user[0]["hashed_password"])
			}).then((result) => {
				console.log('result from hashed password comparison was:', result)
				if (result === true) {
					console.log('Successful user match, sending user data to frontend...')
					var user_info = {
						user_id: user[0].user_id,
						employee_id: user[0].employee_id,
						user_email: user[0].user_email,
						user_type: user[0].user_type,
						is_authorized: true
					}
					return user_info
				} else {
					console.log('result from password comparison is false, will return { is_authorized: false }')
					return { is_authorized: false }
				}

			})
		}
	})
}


module.exports = {
    hashPassword,
    getUserByEmail,
    createUser,
    checkPasswordForEmail,
};