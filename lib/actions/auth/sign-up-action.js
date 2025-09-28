"use server"

const signUpAction = async (data) => {
    console.log("Sign-up data:", data)

    // Await a Promise that resolves after the desired delay (2000 milliseconds or 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Simulated sign-up process complete.")

    // Return the result after the delay has passed
    return {
        success: true,
        message: "Sign-up successful!"
    }
}

export { signUpAction }