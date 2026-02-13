import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const usersSchema = z.object({
    firstName: z.string().min(1, { message: "First is name is required" }),
    lastName: z.string().min(1, { message: "Last is name is required" }),
    email: z.string().min(1, { message: "Email address is required" }).email(),
    image: z
        .any()
        .optional()
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            "Invalid image type",
        )
        .refine(
            (files) =>
                !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
            "Max file size is 2MB",
        ),
});

export { usersSchema };
