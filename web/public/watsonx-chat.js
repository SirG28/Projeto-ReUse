window.wxOConfiguration = {
  style: {
    headerColor: "#7aa61c",
    primaryColor: "#7aa61c",
    userMessageBackgroundColor: "#dce8c2",
  },
  orchestrationID:
    "7a303301510c4b2ba69fad4f1540281b_06e38adf-122e-4aa4-84e4-96caaaedc872",
  hostURL: "https://au-syd.watson-orchestrate.cloud.ibm.com",
  rootElementID: "root",
  deploymentPlatform: "ibmcloud",
  crn: "crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/7a303301510c4b2ba69fad4f1540281b:06e38adf-122e-4aa4-84e4-96caaaedc872::",
  chatOptions: {
    agentId: "c1883b51-ded8-4bb5-aa6d-f97a08483f99",
  },
};
setTimeout(function () {
  const script = document.createElement("script");
  script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
  script.addEventListener("load", function () {
    wxoLoader.init();
  });
  document.head.appendChild(script);
}, 0);
