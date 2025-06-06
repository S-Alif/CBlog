/**
 * Handles API requests.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {Object} [data={}] - The data to be sent with the request. This is optional and defaults to an empty object.
 * @param {boolean} [showToast=false] - A flag indicating whether to show a toast notification upon completion of the request. This is optional and defaults to false.
 *
 * @returns {Promise} A promise that resolves with the response of the API request.
 */
import axios from 'axios'


const apiHandler = async (url, method, data = {}, showToast = false) => {
    const options = {
        url,
        method,
        data
    }

    try {
        const result = await axios(options)
        const response = result.data

        if (showToast) {
            // show the toast notification
        }

        return response?.data

    }
    catch (error) {
        console.error('API request failed:', error)
        const message = error?.response?.data?.message
        if (message) {
            // show the toast notification with the error message
        }
        else {
            // show a generic error message
        }
        return false
    }

}

export default apiHandler