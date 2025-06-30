import api from "../api/axios";
import FormData from "form-data";

export const registerUser = async (userData: {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  profileImage: string | null;
  backgroundPhoto: string | null;
}) => {
  const formData = new FormData();

  formData.append("name", userData.name);
  formData.append("phone", userData.phone);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("address", userData.address);

  if (userData.profileImage) {
    const filename = userData.profileImage.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : "image";

    formData.append("profileImage", {
      uri: userData.profileImage,
      name: filename,
      type,
    } as any);
  }

  if (userData.backgroundPhoto) {
    const filename = userData.backgroundPhoto.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : "image";

    formData.append("backgroundPhoto", {
      uri: userData.backgroundPhoto,
      name: filename,
      type,
    } as any);
  }

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
