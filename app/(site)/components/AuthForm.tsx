"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import Cookies from "js-cookie";

type STATUS = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [status, setStatus] = useState<STATUS>("LOGIN");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = useCallback(() => {
    if (status === "LOGIN") {
      setStatus("REGISTER");
    } else {
      setStatus("LOGIN");
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);

    if (status === "REGISTER") {
      axios.post("/api/register", data).then((response) => {
        if (!response.data) {
          toast.error("User already exists!");
        } else {
          router.push("landing");
        }
      });
    }

    if (status === "LOGIN") {
      axios.post("/api/login", data).then((response) => {
        if (!response.data) {
          toast.error("Invalid credentials!");
        } else {
          Cookies.set("token", response.data);
          router.push("landing");
        }
      });
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
      bg-white
        px-4
        py-8
        shadow
        sm:rounded-lg
        sm:px-10
      "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {status === "REGISTER" && (
            <Input
              disabled={loading}
              register={register}
              errors={errors}
              required
              id="name"
              label="Name"
            />
          )}
          <Input
            disabled={loading}
            register={register}
            errors={errors}
            required
            id="email"
            label="Email address"
            type="email"
          />
          <Input
            disabled={loading}
            register={register}
            errors={errors}
            required
            id="password"
            label="Password"
            type="password"
          />
          <div>
            <Button disabled={loading} fullWidth type="submit">
              {status === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div
          className="
          flex 
          gap-2 
          justify-center 
          text-sm 
          mt-6 
          px-2 
          text-gray-500
        "
        >
          <div>
            {status === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleStatus} className="underline cursor-pointer">
            {status === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
