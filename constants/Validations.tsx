const ValEmail = (email: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email);
};

const ValName = (name: string) => {
  const reg = /^[a-zA-Z\s]+$/;
  return reg.test(name);
};

const ValPassword = (password: string) => {
  const reg = /^.{6,30}$/;
  return reg.test(password);
};

const ConPassword = (password: string, cPassword: string) => {
  return password === cPassword;
};

const OnlyNumbers = (number: string): boolean => {
  var numberRegex = /^\d+(\.\d+)?$/;
  return numberRegex.test(number);
};

export { ValEmail, ValName, ValPassword, ConPassword, OnlyNumbers };
