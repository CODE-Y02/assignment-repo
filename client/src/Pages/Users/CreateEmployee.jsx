import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, createClient } from "../../redux/action/user";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  username: z.string().min(2, "Username must be at least 2 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  phone: z.string().regex(/^\d{10,11}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateUser = ({ open, setOpen, scroll, role = "employee" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // get the reset function
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      phone: "",
      email: "",
    },
  });
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const onSubmit = (data) => {
    if (role === "employee") {
      dispatch(createEmployee(data, setOpen));
    }

    if (role === "client") {
      dispatch(createClient(data, setOpen));
    }

    reset(); // reset the form after submission
  };

  const handleClose = () => {
    setOpen(false);
    reset(); // reset the form on close
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New Employee</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
              <div className="text-xl flex justify-start items-center gap-2 font-normal">
                <PiNotepad size={23} />
                <span>Employee Details</span>
              </div>
              <Divider />
              <table className="mt-4">
                <tbody>
                  <tr>
                    <td className="pb-4 text-lg">First Name </td>
                    <td className="pb-4">
                      <TextField
                        size="small"
                        fullWidth
                        {...register("firstName")}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="pb-4 text-lg">Last Name </td>
                    <td className="pb-4">
                      <TextField
                        size="small"
                        fullWidth
                        {...register("lastName")}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="pb-4 text-lg">User Name </td>
                    <td className="pb-4">
                      <TextField
                        size="small"
                        fullWidth
                        {...register("username")}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="pb-4 text-lg">Email </td>
                    <td className="pb-4">
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Optional"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start pt-2 text-lg">Password </td>
                    <td className="pb-4">
                      <TextField
                        type="password"
                        {...register("password")}
                        size="small"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start pt-2 text-lg">Phone </td>
                    <td className="pb-4">
                      <TextField
                        type="number"
                        size="small"
                        {...register("phone")}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleClose}
              variant="contained"
              type="reset"
              className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              variant="contained"
              className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
            >
              {isFetching ? "Submitting..." : "Submit"}
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateUser;
