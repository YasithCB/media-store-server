// import axios from "axios";
//
// export async function sendUaeOtpSms(mobile, otp) {
//     const payload = {
//         recipient: mobile,
//         sender: process.env.UNIFONIC_SENDER_ID,
//         content: `Your Meat Shop verification code is ${otp}. Valid for 15 minutes.`,
//     };
//
//     const headers = {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "Authorization": `Bearer ${process.env.UNIFONIC_API_KEY}`
//     };
//
//     try {
//         const response = await axios.post(
//             "https://eu.api.unifonic.com/rest/Messages/Send",
//             payload,
//             { headers }
//         );
//
//         return response.data;
//
//     } catch (error) {
//         console.error("SMS Error:", error.response?.data || error.message);
//         throw new Error("Failed to send SMS");
//     }
// }
