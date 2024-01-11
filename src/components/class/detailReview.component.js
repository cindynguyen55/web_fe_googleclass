import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import gradeService from "../../services/grade.service";
import classService from "../../services/class.service";
import gradeReviewService from "../../services/gradereview.service";
import commentService from "../../services/comment.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { read, utils, writeFile } from "xlsx";
import UpdateGrade from "./updateGrade.component";
import { ToastContainer, toast } from "react-toastify";

export function DetailReview() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get("classId");
  const assignmentId = queryParams.get("assignmentId");
  const studentId = queryParams.get("studentId");
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const fref = useRef(null);
  const [open, setOpen] = useState(false);
  const [gradeReview, setGradeReview] = useState({});
  const [assignment, setAssignment] = useState({});
  const [listStudents, setListStudents] = useState([]);
  const [listComments, setListComments] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [comment, setComment] = useState("");
  const [classData, setClassData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const notifyCreateSusscess = () => toast.success("Update Request Success!");
  const notifyCreateFail = () => toast.error("Update Request Failed!");

  function handleRequest(option) {
    async function updateRequest() {
      try {
        await gradeReviewService
          .updateAcceptedGradeReview(gradeReview.reviewId, option)
          .then(
            (res) => {
              if (res.status === 201) {
                notifyCreateSusscess();
                setUpdateLoading(false);
              }
            },
            (error) => {
              notifyCreateFail();
              setUpdateLoading(false);
              console.log(error);
              setMessage("Update Request Fail");
            }
          );
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    updateRequest();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (fref.current) {
    }
    async function addComment() {
      try {
        if (comment !== "") {
          await commentService.createComment(
            gradeReview.reviewId,
            comment,
            userId
          );

          setListComments([
            ...listComments,
            { commenterId: userId, commentText: comment },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    addComment();
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await classService.getbyid(classId);
        setClassData(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
      try {
        const res = await gradeService.getSingleAssignment(assignmentId);
        setAssignment(res?.data?.data);
        setMessage("");
      } catch (error) {
        console.error("Error fetching data");
        setMessage("Error fetching data");
      }
      try {
        const res = await classService.checkteacher(classId, userId);
        setIsTeacher(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setMessage("Error fetching data");
      }
      try {
        const res = await classService.getliststudents(classId);
        setListStudents(res?.data?.data);
      } catch (error) {
        console.error("Error fetching data");
        setMessage("Error fetching data");
      }
      try {
        const res =
          await gradeReviewService.getGradeReviewRequestByStudentIdAndAssignmentId(
            studentId,
            assignmentId
          );
        setGradeReview(res?.data?.data);
        setListComments(res?.data?.comments);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setMessage("Error fetching data");
      }
      setLoading(false);
    };
    fetchData();
  }, [assignmentId]);

  return (
    <div className=" ">
      {loading && (
        <div className="place-items-center mx-auto col-span-2">
          <span className="spinner-border spinner-border-lg text-dark-green"></span>
        </div>
      )}
      {!loading && (
        <div>
          <div className="row">
            <Link to={`/home`}>
              <div className="text-xl font-bold text-dark-green mt-1 not-italic ml-2">
                Home
              </div>
            </Link>
            <p className="text-xl font-bold mt-1 not-italic ml-2"> / </p>
            <Link to={`/class/detail?id=${classId}`}>
              <div className="text-xl font-bold text-dark-green mt-1 not-italic ml-2">
                {classData.className}
              </div>
            </Link>
            <p className="text-xl font-bold mt-1 not-italic ml-2"> / </p>
            <div className="text-xl font-bold mt-1 not-italic ml-2">
              {assignment.name}
            </div>
          </div>
          <div className="row">
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              Review for Student{" "}
              {listStudents.find((x) => x.studentId == studentId)?.mssv}
            </div>
          </div>
          <div className="row">
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              Current Grade: {gradeReview.currentGrade}
            </div>
          </div>
          <div className="row">
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              Expectation Grade: {gradeReview.expectationGrade}
            </div>
          </div>
          <div className="row">
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              Student Explanation: {gradeReview.studentExplanation}
            </div>
          </div>
          <div className="row py-4">
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              <button
                className="bg-dark-green text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setUpdateLoading(true);
                  handleRequest("accepted");
                }}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <div className="place-items-center mx-auto col-span-2">
                    <span className="spinner-border spinner-border-lg text-dark-green"></span>
                  </div>
                ) : (
                  "Accept Request"
                )}
              </button>
            </div>
            <div className="text-2xl text-dark-green font-bold mt-3 px-4">
              <button
                className="bg-dark-green text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setUpdateLoading(true);
                  handleRequest("refused");
                }}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <div className="place-items-center mx-auto col-span-2">
                    <span className="spinner-border spinner-border-lg text-dark-green"></span>
                  </div>
                ) : (
                  "Refuse Request"
                )}
              </button>
            </div>
          </div>
          <div>
            <Form onSubmit={handleSubmit} ref={fref}>
              <div>
                <div className="form-group">
                  <Input
                    type="text"
                    className="form-control p-3 rounded required"
                    name="gradename"
                    placeholder="Mark your comment"
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                </div>
              </div>
            </Form>
          </div>
          <div>
            {listComments.map((comment) => {
              return (
                <div className="row">
                  <div className="text-2xl text-dark-green font-bold mt-3 px-4">
                    {comment.commenterId === userId
                      ? "You"
                      : isTeacher
                      ? "Student"
                      : "Teacher"}
                    : {comment.commentText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
