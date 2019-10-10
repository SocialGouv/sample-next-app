export default function handle(req, res) {
  const question = req.query.query;
  res.json({
    answer: `The answer to ${question} is 42`
  });
}
