import axios from "../api/useCommonAxios";
const autoLogout = () => {
  console.log(`로그아웃`);
  const logout = async () => {
    const menuClickList = JSON.parse(localStorage.getItem("menuClick"));
    return await axios.post("https://iam-api.site/api/logout", menuClickList);
  };
  return logout;
};
export default autoLogout;
