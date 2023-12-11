
import { Classheader } from "./classheader.component";
import React, { useState, useEffect } from "react";
import classService from "../../services/class.service";
import Popup from "reactjs-popup";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input
} from "@material-tailwind/react";
 

export function TabNews(id ) {

    const [classdetail, setClassdetail] = useState({});
    const [message,setMessage]=useState('');
    const [email,setEmail]=useState('');
    const [isTeacher,setIsTeacher]=useState(false);
    const [invitestudent,setlinkstu]=useState('');
    const [inviteteacher,setinviteteacher]=useState('');
    
    const [open, setOpen] = React.useState(false);
 
    const handleOpen = () => {
      setOpen(!open)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await classService.getbyid(id.id);
              const user=JSON.parse(localStorage.getItem("user"));
              const istecher= await classService.checkteacher(id.id,user.id);
              setIsTeacher(istecher.data.data);
          
              setClassdetail(res.data.data)
              const linkstudent=await classService.getivitelinkstudent(id.id);
              console.log(linkstudent.data.data);
              setlinkstu(linkstudent.data.data);

              if(isTeacher===true){
                const linkteacher=await classService.getivitelinkteacher(id.id);
                setinviteteacher(linkteacher.data.data);
              }
            } catch (error) {
              console.error('Error fetching data:', error.message);
            }
          };
        fetchData();

    }, [id]);
  const handleinvitestudent=()=>{
    console.log("invite studnet");
    const dat1 = async () => {
      try {
        console.log(id.id);
       const invite=await classService.getinvitestudent(id.id,email);
       setMessage("Success");
      } catch (error) {
        setMessage("Error");
        console.error('Error fetching data:', error.message);
      }
    };
  dat1();
  }
  const handleinviteteacher=()=>{ 
     const dat2 = async () => {
            try {
             const invite=await classService.getinviteteacher(id.id,email);
             setMessage("Success");
            } catch (error) {
              setMessage("Error");
              console.error('Error fetching data:', error.message);
            }
          };
        dat2();
  }
  
    
    return (
        <div className=" ">
        
          <div className="form-group text-right">
              <button  onClick={handleOpen} className="w-48 py-2.5 text-white bg-dark-green rounded-lg text-base mt-3"
              >
                  Invite people</button>
          </div>
                      
        <div className=" w-80">
        <Dialog open={open} handler={handleOpen} className="w-96 border-4" >
          <DialogHeader>Its a simple dialog.</DialogHeader>
          <DialogBody>
          <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
               Invite people link
              </Typography>
              <Input
                size="lg"
                readOnly={true}
                placeholder="link"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={invitestudent}
              />
          </div>
         
          {isTeacher===true &&
          <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
               Invite memorizer link
              </Typography>
              <Input
                size="lg"
                readOnly={true}
                placeholder="link"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={inviteteacher}
              />
          </div>}

           <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
               Invite people by email
              </Typography>
              <Input
                size="lg"
                placeholder="email"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />
              
          </div>
          <div className="mb-1 flex flex-col gap-6">
         
              <button  onClick={handleinvitestudent} className="m-2 py-2.5 text-white bg-dark-green rounded-lg text-base mt-3"
              >
                  Invite people
                  </button>
                  
          {isTeacher===true &&
    
                  <button  onClick={handleinviteteacher} className="m-2 py-2.5 text-white bg-dark-green rounded-lg text-base mt-3"
                  >
                      Invite teacher</button>
                }
           </div>
           {message==="Error" && (
              <div className="text-error-color text-base">Gửi lời mời thất bại</div>
            )}
            {message==="Success" && (
              <div className="alert alert-success text-base">Gửi lời mời thành công</div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleOpen}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
        </div>
            <Classheader data={classdetail}></Classheader>
        </div>
    );
}