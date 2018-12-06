import React from 'react'
import { withFormik, Form, Field } from "formik";
import * as Yup from 'yup'; // yup bug https://stackoverflow.com/questions/50753832/formik-and-yup-typeerror-cannot-read-property-object-of-undefined

      /* Need a form with:
      Name
      Address
      Email address
      Phone number
      Profile photo upload
      Resume upload 

      Formik file upload:
        -> https://hackernoon.com/formik-handling-files-and-recaptcha-209cbeae10bc

      */
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const FormValidationSchema = Yup.object().shape({
  email: Yup.string().email('Email address does not appear to be valid.').required('Please provide your email address.'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Please provide your email address.')
})

const ProfileForm = ({
  // values, //<-- accessible if we want to examine or track form state within the form, such as a checkbox
  errors,
  touched,
  isSubmitting
}) => (
  <Form>
    <div>
      <label for="email">Email address:</label>
      { touched.email && errors.email && <p>{errors.email}</p> }
        <Field type="email" name="email" placeholder="Email"></Field>
    </div>
    <div>
      <label for="phoneNumber">Phone Number:</label>
      {touched.phoneNumber && errors.phoneNumber && <p>{errors.phoneNumber}</p>}
        <Field type="phoneNumber" name="phoneNumber" placeholder="xxx-xxx-xxxx" type="tel" ></Field>
    </div>
    <div>
      <label for="address">Address:</label>
      {touched.address && errors.address && <p>{errors.address}</p>}
      <Field type="address" name="address" placeholder="address"></Field>
    </div>
    <div>
      <label for="city">City:</label>
      {touched.city && errors.city && <p>{errors.city}</p>}
      <Field type="city" name="city" placeholder="city"></Field>
    </div>
    <div>
      <label for="city">State:</label>
      {touched.state && errors.state && <p>{errors.state}</p>}
      <Field type="state" name="state" placeholder="state"></Field>
    </div>
    <button type="submit">Submit</button>
  </Form>
)

const FormikProfileForm = withFormik({
  // creates a 'values' property which is accessible in the form
  mapPropsToValues({ email, phoneNumber, address, city, state}) {
    return {
      email: email || '',
      phoneNumber: phoneNumber || '',
      address: address || '',
      city: city || '',
      state: state || '',
    }
  },
  getValidationSchema(values){
    return FormValidationSchema
  },
  handleSubmit(values){
    console.log('form values are:', values)
  }
})(ProfileForm)

export default FormikProfileForm