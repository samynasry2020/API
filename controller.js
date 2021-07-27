const fetch = require("node-fetch");

////////Handel async errors///////
function handelAsync(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch(next);
  };
}

////////Validate Date/////////////
function validateSearchInput(input) {
  if (!input) return { status: false, message: "empty field" };
  //Check Symbols
  const symbols = new RegExp(/[^\w\s,.&]|_/);
  if (input.match(symbols))
    return {
      status: false,
      message: "bad input",
    };
  else return { status: true };
}

//////////////////////////////////
function fetchSearch(name) {
  return fetch(process.env.END_POINT + name, {
    method: "GET",
    headers: {
      Authorization: process.env.API_KEY,
    },
  }).then((res) => res.json());
}

//////////////////////////////////
exports.searchComp = handelAsync(async (req, res, next) => {
  let { name } = req.params;
  const input = validateSearchInput(name);
  if (!input.status) throw new Error(input.message);
  name = name.replace(/ /g, "-");
  name = encodeURIComponent(name);
  const data = await fetchSearch(name);
  const available = !data.total_results;
  res.status(200).json({
    status: "success",
    available,
  });
});

//////////////////////////////////
exports.handelGlobalError = (error, req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: error.message,
  });
};
