//

import answerQuery from "../../pages/api/answer/[query].js";

test("question anything should return anything is 42", () => {
  const req = { query: { query: "anything" } };
  const res = { json: jest.fn() };

  answerQuery(req, res);

  expect(res.json).toHaveBeenCalledWith({
    answer: "The answer to anything is 42"
  });
});
