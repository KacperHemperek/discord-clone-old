export const toBase64 = async (file: File) => {
  const reader = new FileReader();
  let resultVal: string;
  console.log(reader.result);
  reader.onloadend = () => {
    resultVal = (reader.result as string)
      ?.replace("data:", "")
      .replace(/^.+,/, "");
  };
  reader.readAsDataURL(file);
};
