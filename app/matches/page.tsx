"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import MatchModal from "@/components/MatchModal";

type SwipeUser = {
  id: number;
  name: string;
  age: number;
  course: string;
};

type DevUser = {
  id: number;
  name: string;
};

type Direction = "left" | "right" | "none";

export default function MatchesPage() {
  const [users, setUsers] = useState<SwipeUser[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const [matchedUser, setMatchedUser] = useState<SwipeUser | null>(null);

  // 🟣 Day 15: DEV user switching
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<DevUser[]>([]);

  // Safety + animation
  const likedUserIds = useRef<Set<number>>(new Set());
  const swipeDirection = useRef<Direction>("none");

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // 🔹 Load DEV users
  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem("currentUserId");

      const res = await fetch("/api/users");
      const data = await res.json();
      setAllUsers(data);

      if (saved) {
        setCurrentUserId(Number(saved));
      } else if (data.length > 0) {
        setCurrentUserId(data[0].id);
        localStorage.setItem("currentUserId", String(data[0].id));
      }
    };

    init();
  }, []);

  // 🔹 Fetch swipe candidates (IMPORTANT: /api/swipe)
  useEffect(() => {
    if (!currentUserId) return;

    const fetchSwipeUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/swipe", {
          headers: {
            "x-user-id": String(currentUserId),
          },
        });
        const data = await res.json();
        setUsers(data);
        setIndex(0);
      } catch (err) {
        console.error("Failed to load swipe users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSwipeUsers();
  }, [currentUserId]);

  const current = users[index];

  const switchUser = (id: number) => {
    localStorage.setItem("currentUserId", String(id));
    likedUserIds.current.clear();
    setCurrentUserId(id);
    window.location.reload();
  };

  const triggerExit = () => setVisible(false);

  // ❤️ LIKE
  const handleLike = async () => {
    if (!current || !currentUserId) return;

    if (likedUserIds.current.has(current.id)) return;
    likedUserIds.current.add(current.id);

    swipeDirection.current = "right";
    setVisible(false);

    const res = await fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": String(currentUserId),
      },
      body: JSON.stringify({ toUserId: current.id }),
    });

    const data = await res.json();

    if (data.matched) {
      setMatchedUser(current);
    }
  };

  // ⬅ SKIP
  const handleSkip = () => {
    swipeDirection.current = "left";
    triggerExit();
  };

  if (loading || !currentUserId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 overflow-hidden">

      {/* 🟣 DEV USER SWITCHER */}
      <div className="fixed top-6 left-6 z-50 bg-white shadow rounded-xl px-4 py-2">
        <p className="text-xs text-gray-500 mb-1">DEV USER</p>
        <div className="flex gap-2 flex-wrap">
          {allUsers.map(user => (
            <button
              key={user.id}
              onClick={() => switchUser(user.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                user.id === currentUserId
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {user.name} ({user.id})
            </button>
          ))}
        </div>
      </div>

      {/* ❤️ Connections */}
      <Link
        href="/connections"
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:scale-105 transition"
      >
        ❤️
      </Link>

      <AnimatePresence
        onExitComplete={() => {
          setIndex(prev => prev + 1);
          setVisible(true);
          x.set(0);
          swipeDirection.current = "none";
        }}
      >
        {current && visible ? (
          <motion.div
            key={current.id}
            style={{ x, rotate }}
            className="w-[420px] bg-white rounded-3xl shadow-2xl p-8 text-center absolute"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 120) {
                swipeDirection.current = "right";
                triggerExit();
              } else if (info.offset.x < -120) {
                swipeDirection.current = "left";
                triggerExit();
              }
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x:
                swipeDirection.current === "right"
                  ? 500
                  : -500,
              opacity: 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {current.name[0]}
            </div>

            <h2 className="text-2xl font-bold">{current.name}</h2>
            <p className="text-gray-500 mb-6">
              {current.age} • {current.course}
            </p>

            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="px-6 py-3 rounded-full border border-gray-300"
              >
                ⬅ Skip
              </button>

              <button
                onClick={handleLike}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
              >
                ❤️ Like
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!current && (
        <p className="text-gray-500 text-lg">No more users 👀</p>
      )}

      {matchedUser && (
        <MatchModal
          name={matchedUser.name}
          age={matchedUser.age}
          course={matchedUser.course}
          onClose={() => setMatchedUser(null)}
        />
      )}
    </main>
  );
}