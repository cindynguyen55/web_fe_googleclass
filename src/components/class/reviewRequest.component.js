import React, { useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { tab } from "@material-tailwind/react";
import {} from "@heroicons/react/24/solid";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import gradeReviewService from "../../services/gradereview.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="text-error-color text-base" role="alert">
        This field is required!
      </div>
    );
  }
};

const checkPoint = (value) => {
  if (value < 0) {
    return (
      <div className="text-error-color text-base" role="alert">
        Points must be greater than 0!
      </div>
    );
  }
  if (value > 10) {
    return (
      <div className="text-error-color text-base" role="alert">
        Points must be less than 10!
      </div>
    );
  }
};

const ReviewRequest = (assignmentId, classId, score, handleOpen) => {
  const fref = useRef(null);
  const [grade, setGrade] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const notifyUpdateSusscess = () => toast.success("Request Success!");
  const notifyUpdateFail = () => toast.error("Request Fail!");
  const studentId = JSON.parse(localStorage.getItem("user")).id;

  function handleSubmit(e) {
    e.preventDefault();
    if (fref.current) {
      fref.current.validateAll();
    }
    async function submitReviewRequest() {
      try {
        if (grade === "") {
          notifyUpdateFail();
          setMessage("Grade is required");
          setIsLoading(false);
          return;
        }
        gradeReviewService
          .createGradeReviewRequest(
            studentId,
            assignmentId.assignmentId,
            assignmentId.classId,
            assignmentId.score,
            grade,
            reason
          )
          .then(
            (res) => {
              if (res.status === 201) {
                notifyUpdateSusscess();
                setIsLoading(false);
                setTimeout(() => {
                  window.location.reload();
                }, 800);
              }
            },
            (error) => {
              setIsSubmit(true);
              notifyUpdateFail();
              console.log(error);
              setIsLoading(false);
              setMessage("Upload Grade Fail");
            }
          );
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    submitReviewRequest();
  }

  return (
    <>
      <div className=" ">
        <div className="flex flex-col justify-end px-4">
          <div className="text-2xl text-dark-green font-bold mt-3">
            Review Request
          </div>
          <div className="my-3">
            <Form onSubmit={handleSubmit} ref={fref}>
              <div>
                <div className="form-group">
                  <label htmlFor="classname" className="font-semibold mb-2">
                    Your current score
                  </label>
                  <Input
                    type="text"
                    className="form-control p-3 rounded required"
                    name="classname"
                    readOnly={true}
                    value={assignmentId.score}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="font-semibold mb-2 mt-2">
                    Your desired score
                  </label>
                  <Input
                    type="text"
                    className="form-control p-3 rounded"
                    name="email"
                    onChange={(e) => {
                      setGrade(e.target.value);
                    }}
                    validations={[required, checkPoint]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="classname" className="font-semibold mb-2">
                    Reason
                  </label>
                  <Input
                    type="text"
                    className="form-control p-3 rounded required"
                    name="classname"
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                  />
                </div>
                {isSubmit && (
                  <div className="text-error-color text-base italic">
                    {message}
                  </div>
                )}
                <div className="form-group text-right">
                  <button
                    className="w-48 py-2.5 text-white bg-dark-green rounded-lg text-base mt-3"
                    onClick={() => {
                      setIsLoading(true);
                    }}
                  >
                    {isLoading && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    Upload
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ReviewRequest;
