const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const authToken = async () => {
  const myHeaders = new Headers();
  myHeaders.append("user-email", `${process.env.EMAIL}`);
  myHeaders.append("api-token", `${process.env.API_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      requestOptions
    );
    const result = await response.json();
    return result.auth_token;
  } catch (error) {
    console.log(error);
  }
};

const getallCountries = async () => {
  const auth_token = await authToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${auth_token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://www.universal-tutorial.com/api/countries",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getallState = async (country) => {
  const auth_token = await authToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${auth_token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://www.universal-tutorial.com/api/states/${country}`,
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getallCities = async (city) => {
  const auth_token = await authToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${auth_token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://www.universal-tutorial.com/api/cities/${city}`,
      requestOptions
    );
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getallCountries, getallState, getallCities };
