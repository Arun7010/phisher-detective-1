async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/elftsdmr/malware-url-detect",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({ inputs: "" }).then((response) => {
  //console.log(response.label);
  console.log(JSON.stringify(response));
});
