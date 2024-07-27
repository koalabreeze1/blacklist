"use client";

import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Github, Play, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";

const users = [
  {
    id: "1027342647595106314",
    name: "drop19s",
    image: "/image.jpeg",
    clip: 1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    reason: "ZMyvE0YLK5uiHXu618TMayCmCRdMg5o4XtgQ41phWD3Z6XqB",
  },
  {
    id: "1027342647595106315",
    name: "Jane Smith",
    image: "/jane-smith.jpg",
    clip: 0,
    reason: "Short reason",
  },
  {
    id: "1027342647595106316",
    name: "Alice Johnson",
    image: "/alice-johnson.jpg",
    clip: 1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "1027342647595106317",
    name: "Christopher Fanta",
    image: "/christopher-fanta.jpg",
    clip: 0,
    reason: "Another example of a longer reason that should wrap properly in the UI",
  },
  {
    id: "1027342647595106318",
    name: "Lamar James",
    image: "/lamar-james.jpg",
    clip: 1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "1027342647595106319",
    name: "Jahiem Yeager",
    image: "/jahiem-yeager.jpg",
    clip: 0,
    reason: "Brief reason",
  },
];

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const searchVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const clipChecked = watch("clipCheckbox");

  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
    ), [searchTerm]
  );

  const truncateName = (name: string) =>
    name.length > 20 ? `${name.slice(0, 20)}...` : name;

  const handleUserClick = useCallback((userId: string) => {
    setExpandedUserId(prevId => prevId === userId ? null : userId);
  }, []);

  const handlePlayButtonClick = useCallback((event: React.MouseEvent, videoUrl?: string) => {
    event.stopPropagation();
    if (videoUrl) {
      setDialogOpen(true);
      setCurrentVideoUrl(videoUrl);
      setVideoLoadError(false);
    }
  }, []);

  const handleVideoError = () => setVideoLoadError(true);

  const onSubmit = (data: any) => {
    console.log(data);
    setAddDialogOpen(false);
    reset();
  };

  return (
    <TooltipProvider>
      <main className="flex min-h-screen flex-col items-center justify-between bg-[#141414] pt-12 pb-8 px-4">
        <motion.div
          className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 rounded-lg p-4 mb-2 flex justify-between items-center"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <Input
            type="text"
            placeholder="Search users by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1f1f1f] text-white font-sans font-semibold text-lg text-center border-none focus:ring-0 focus:outline-none w-full placeholder:text-white h-16"
          />
          <Button onClick={() => setAddDialogOpen(true)} className="ml-2 p-2 bg-[#2a2a2a] text-white hover:bg-[#333]">
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>

        <ScrollArea className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 rounded-lg bg-[#1f1f1f]" style={{ height: '370px' }}>
          <motion.div
            className="px-4 pt-4"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    className={`flex flex-col items-start p-4 rounded-md mb-4 hover:bg-[#2a2a2a] cursor-pointer ${expandedUserId === user.id ? 'bg-[#2a2a2a]' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={searchVariants}
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="flex-shrink-0 w-12 h-12 mr-4">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-grow items-center mx-2">
                        <div className="flex-grow">
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-white text-lg truncate" style={{ width: '200px' }}>{truncateName(user.name)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>{user.name}</span>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white text-xs bg-[#292929] border border-[#4d4d4d] p-1 rounded">{user.id}</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedUserId === user.id && (
                        <motion.div
                          className="w-full mt-2 flex flex-col items-center"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="w-full p-4 rounded-md">
                            <h3 className="text-white text-lg font-semibold">Reason</h3>
                            <p className="text-white text-sm mt-2 break-words">
                              {user.reason || "No reason provided"}
                            </p>
                          </div>
                          {user.clip === 1 && user.videoUrl && (
                            <button
                              className="flex items-center justify-center mt-4 p-3 bg-[#333] rounded-full"
                              onClick={(event) => handlePlayButtonClick(event, user.videoUrl)}
                            >
                              <Play className="text-white h-6 w-6" />
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.p className="text-white text-center" variants={searchVariants}>
                  No users found.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1f1f1f] text-white">
            <DialogTitle className="text-white">Play Option</DialogTitle>
            <DialogDescription className="text-white">
              {currentVideoUrl ? (
                <iframe
                  width="100%"
                  height="315"
                  src={currentVideoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleVideoError}
                ></iframe>
              ) : (
                <p>No video available</p>
              )}
              {videoLoadError && <p className="text-red-500">Error loading video. Please try again later.</p>}
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="bg-[#1f1f1f] text-white">
            <DialogTitle className="text-white">Add New User</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
              <Label htmlFor="username">Discord ID</Label>
              <Input
                id="username"
                {...register("username", { required: true })}
                className="bg-[#2a2a2a] text-white"
              />
              {errors.username && <p className="text-red-500">This field is required.</p>}

              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                {...register("reason", { required: true })}
                className="bg-[#2a2a2a] text-white"
              />
              {errors.reason && <p className="text-red-500">This field is required.</p>}

              <Label htmlFor="clipCheckbox" className="flex items-center space-x-2">
                <Checkbox id="clipCheckbox" {...register("clipCheckbox")} />
                <span className="text-white">Clip</span>
              </Label>

              <Button type="submit" className="mt-4 bg-[#333] hover:bg-[#444]">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
        <motion.div className="mt-8" initial="hidden" animate="visible" variants={fadeInVariants}>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <Github className="h-8 w-8" />
          </a>
        </motion.div>
      </main>
    </TooltipProvider>
  );
}
