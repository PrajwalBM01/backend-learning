import { Router } from "express";
import { email, z } from "zod";

const registerUserSchema = z.object({
  email: z.email(),
  name: z.string(),
});

type registerUserType = z.infer<typeof registerUserSchema>;

const router = Router();

router.post("/register", (req, res) => {
  const body: registerUserType = registerUserSchema.parse(req.body);
  console.log(body);
  console.log(body.name.toUpperCase);
  res.send("ok");
});

export default router;
