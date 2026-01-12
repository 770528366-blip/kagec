import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- Types & Constants ---

// use new Date(year, monthIndex, day) to ensure Local Time midnight
// Month is 0-indexed (3 = April)
const EXAM_DATE = new Date(2026, 3, 11); 
const START_DATE = new Date(2026, 0, 12); // Start from Jan 12, 2026
const STORAGE_KEY = "luodan_checkins_v3";

interface CheckInRecord {
  date: string; // YYYY-MM-DD
  hours: number;
  quote: string;
}

interface StudyTask {
  phase: string;
  focus: string;
  tasks: string[];
}

// --- Local Quotes Library (No AI) ---
const QUOTES = [
  "超声探头是你延伸的手指，每一个切面都是通向真相的窗口。",
  "只有看过足够多的正常图像，才能一眼识别异常。加油，罗丹医生！",
  "多普勒效应不仅仅是物理公式，更是血流的语言。",
  "每天三小时，不仅仅是复习，更是对医学的敬畏。",
  "主治之路虽难，但你已经走在路上。坚持就是胜利！",
  "肝胆胰脾肾，每一个回声都藏着病理的秘密。",
  "心脏的每一次搏动，都在为你今天的努力喝彩。",
  "错题本是你最好的老师，消灭盲点，无往不胜。",
  "沉下心来，分辨力决定了你能看多远，毅力决定了你能走多远。",
  "4月11日是你加冕的日子，现在的汗水都是那天的勋章。",
  "不要被伪像迷惑双眼，要透过现象看本质。",
  "每一个复杂的先天性心脏病，拆解开来都是基础切面的组合。",
  "今天的努力，是为了在考场上看到题目时那一刻的自信。",
  "妇产科的每一个数据，都关乎生命的重量，背下来！",
  "浅表器官虽小，却往往是考分的分水岭，不可大意。",
  "调整好仪器的参数，也调整好自己的心态。",
  "星光不问赶路人，时光不负有心人。超声主治必过！",
  "把书读薄，再把书读厚。现在的你正在质变。",
  "耐得住寂寞，才守得住繁华。备考是孤独的，但结果是甜的。",
  "再坚持一下，你比你自己想象的更强大。"
];

// --- Helper Functions ---

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Calculate days from a specific date until the exam
const getDaysUntilExam = (fromDate: Date) => {
  // Use UTC to count calendar days strictly
  const current = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const target = Date.UTC(EXAM_DATE.getFullYear(), EXAM_DATE.getMonth(), EXAM_DATE.getDate());
  
  const diffDays = Math.floor((target - current) / (1000 * 60 * 60 * 24));
  return diffDays;
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getRandomQuote = () => {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index];
};

// --- Study Plan Logic (Refined for Jan 12 - Apr 11, 2026) ---

const getStudyPlan = (date: Date): StudyTask => {
  // Use date components directly to avoid timezone shift from string parsing
  const y = date.getFullYear();
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();
  const currentVal = y * 10000 + m * 100 + d; // Integer comparison YYYYMMDD

  // Helper to check range cleanly - Updated to 2026
  const checkRange = (startM: number, startD: number, endM: number, endD: number) => {
    const startVal = 20260000 + startM * 100 + startD;
    const endVal = 20260000 + endM * 100 + endD;
    return currentVal >= startVal && currentVal <= endVal;
  };

  // Phase 1: Pre-Start & Physics (Jan 12 - Jan 31) - Extended start
  if (checkRange(1, 12, 1, 31)) {
    return {
      phase: "第一阶段：抢跑期与物理基础",
      focus: "调整状态 & 夯实基础：声学原理、伪像、多普勒技术",
      tasks: [
        "📖 教材精读：超声物理学基础章节（侧重：分辨力、衰减、调节）",
        "📺 视频课：多普勒效应原理与各类伪像产生机制详解",
        "📝 专项刷题：物理基础专项练习 30 题（提前进入备考状态）",
      ],
    };
  }
  
  // Phase 2: Abdomen (Feb 1 - Feb 20) - 20 Days
  if (checkRange(2, 1, 2, 20)) {
    return {
      phase: "第二阶段：腹部与消化系统",
      focus: "系统突破：肝、胆、胰、脾、肾、消化道",
      tasks: [
        "📖 知识点：弥漫性肝病、肝脏占位、胆系结石与肿瘤鉴别",
        "📺 视频课：腹部疑难病例图像解析（关注微小病变与鉴别诊断）",
        "📝 章节刷题：腹部系统真题 50 题 + 错题深度解析",
      ],
    };
  }

  // Phase 3: Cardiovascular (Feb 21 - Mar 15) - 23 Days (Extended for difficulty)
  if (checkRange(2, 21, 3, 15)) {
    return {
      phase: "第三阶段：心血管系统（攻坚战）",
      focus: "攻克难点：心脏解剖、动力学、先心病、瓣膜病",
      tasks: [
        "🎨 绘图记忆：默画心脏大血管短轴、四腔心、五腔心切面",
        "📺 视频课：法洛四联症、房/室间隔缺损、心肌病超声表现",
        "📝 强化刷题：心血管专项 60 题（重点突破血流动力学计算题）",
      ],
    };
  }

  // Phase 4: OB/GYN & Small Parts (Mar 16 - Mar 31) - 16 Days
  if (checkRange(3, 16, 3, 31)) {
    return {
      phase: "第四阶段：妇产与浅表器官",
      focus: "广度覆盖：产筛、子宫附件、甲状腺、乳腺",
      tasks: [
        "📖 背诵表格：胎儿生长发育孕周表、TI-RADS / BI-RADS 分级",
        "📺 视频课：胎儿心脏筛查切面、异位妊娠、浅表淋巴结",
        "📝 综合刷题：妇产+浅表混合练习 60 题（注意细节考点）",
      ],
    };
  }

  // Phase 5: Sprint (Apr 1 - Apr 10) - 10 Days (Adjusted for Apr 11 exam)
  if (checkRange(4, 1, 4, 10)) {
    return {
      phase: "第五阶段：冲刺与全真模拟",
      focus: "查漏补缺：全真模拟、错题清零、数值背诵",
      tasks: [
        "⏱️ 全真模考：严格按照考试时间进行 100 题测试 (人机对话模拟)",
        "📒 错题回顾：重做之前的错题本，确保盲点清零",
        "🧠 记忆突击：复习正常值范围、诊断标准等死记硬背内容",
      ],
    };
  }

  // Exam Day (Apr 11)
  if (checkRange(4, 11, 4, 11)) {
    return {
      phase: "决战日",
      focus: "沉着冷静，金榜题名",
      tasks: ["检查准考证和证件", "自信步入考场", "相信自己的判断"],
    };
  }

  // Pre-Start
  if (currentVal < 20260112) {
    return {
      phase: "预备阶段",
      focus: "制定计划 & 资料整理",
      tasks: ["整理教材与视频资源", "调整作息，准备开始备考", "熟悉考试大纲"],
    };
  }

  // Post-Exam
  return {
    phase: "考试结束",
    focus: "好好休息",
    tasks: ["庆祝坚持下来的自己", "整理资料留存", "开启新的旅程"],
  };
};

// --- Components ---

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-red-500 animate-pulse"
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

interface CalendarProps {
  checkIns: Record<string, CheckInRecord>;
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const Calendar = ({ checkIns, currentMonth, selectedDate, onSelectDate }: CalendarProps) => {
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month); // 0 = Sunday

  const days = [];
  // Empty slots
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = formatDate(dateObj);
    const isCheckedIn = !!checkIns[dateStr];
    const isToday = isSameDay(dateObj, new Date());
    const isSelected = isSameDay(dateObj, selectedDate);
    const isExamDay = dateStr === formatDate(EXAM_DATE);

    days.push(
      <button
        key={dateStr}
        onClick={() => onSelectDate(dateObj)}
        className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium relative transition-all ${
          isSelected 
            ? "ring-2 ring-medical-600 bg-medical-50 z-10" 
            : isExamDay
              ? "bg-red-100 text-red-800 font-bold border border-red-200"
              : isToday 
                ? "bg-blue-50 text-blue-700 font-bold border border-blue-200" 
                : "bg-white hover:bg-slate-50"
        }`}
      >
        <span className={isSelected ? "text-medical-900" : isExamDay ? "text-red-900" : "text-slate-700"}>
          {d}
          {isExamDay && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
        </span>
        {isCheckedIn && (
          <div className="absolute bottom-0.5">
            <HeartIcon />
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
      <div className="text-center font-bold text-slate-700 mb-4">
        {year}年 {month + 1}月
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs text-slate-400">
        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
};

const App = () => {
  const [checkIns, setCheckIns] = useState<Record<string, CheckInRecord>>({});
  const [hoursInput, setHoursInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());

  // Initialization
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCheckIns(JSON.parse(stored));
    }
  }, []);

  const selectedDateStr = formatDate(selectedDate);
  const isCheckedIn = !!checkIns[selectedDateStr];
  const studyPlan = getStudyPlan(selectedDate);
  
  // Future check: simple comparison of midnight timestamps
  const todayMidnight = new Date();
  todayMidnight.setHours(0,0,0,0);
  const selectedMidnight = new Date(selectedDate);
  selectedMidnight.setHours(0,0,0,0);
  const isFuture = selectedMidnight > todayMidnight;

  const handleCheckIn = async () => {
    const hours = parseFloat(hoursInput);
    
    if (isNaN(hours) || hours < 3) {
      alert("罗丹医生，每天至少要学习3小时才能打卡哦！加油！");
      return;
    }

    setLoading(true);

    // Simulate a brief delay for UX feeling
    setTimeout(() => {
        const quote = getRandomQuote();

        const newRecord: CheckInRecord = {
            date: selectedDateStr,
            hours: hours,
            quote: quote
        };

        const updatedCheckIns = { ...checkIns, [selectedDateStr]: newRecord };
        setCheckIns(updatedCheckIns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCheckIns));
        setLoading(false);
        setHoursInput(""); // Clear input
    }, 600);
  };

  const totalDays = Object.keys(checkIns).length;
  // Calculate streak based on today backwards
  let streak = 0;
  let d = new Date();
  while (checkIns[formatDate(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== displayMonth.getMonth()) {
        setDisplayMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };
  
  // Calculate countdown days based on selectedDate
  const daysUntilExam = getDaysUntilExam(selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-10">
      {/* Header */}
      <header className="bg-medical-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-white absolute -top-4 -left-4"></div>
          <div className="w-40 h-40 rounded-full bg-white absolute bottom-0 right-0"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">罗丹备战主治</h1>
              <p className="text-medical-100 text-sm mt-1">目标：超声医学中级职称 (4月11日)</p>
            </div>
            <div className="text-right">
              {/* Dynamic Countdown */}
              <div className="text-3xl font-bold">
                {daysUntilExam >= 0 ? daysUntilExam : Math.abs(daysUntilExam)}
              </div>
              <div className="text-xs text-medical-100 uppercase tracking-wider">
                {daysUntilExam > 0 ? "距离考试 (天)" : daysUntilExam === 0 ? "⚠️ 就在今天" : "考试已过 (天)"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1">
              <div className="text-xs text-medical-100 mb-1">已打卡天数</div>
              <div className="text-xl font-bold">{totalDays}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1">
              <div className="text-xs text-medical-100 mb-1">当前连续</div>
              <div className="text-xl font-bold">{streak} 天</div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-8 relative z-20 max-w-md mx-auto space-y-6">
        
        {/* Calendar Selection Area */}
        <section>
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-lg font-bold text-slate-800">打卡日历</h2>
            <div className="flex gap-2">
                <button 
                  onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))}
                  className="p-1 text-slate-400 hover:text-medical-600 active:bg-slate-100 rounded"
                >
                  ← 上个月
                </button>
                <button 
                  onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))}
                  className="p-1 text-slate-400 hover:text-medical-600 active:bg-slate-100 rounded"
                >
                  下个月 →
                </button>
            </div>
          </div>
          <Calendar 
            checkIns={checkIns} 
            currentMonth={displayMonth} 
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
        </section>

        {/* Check In Card - Dynamic based on selection */}
        <section className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-1 h-6 bg-medical-500 rounded-full mr-2"></span>
              {selectedDateStr} 打卡
            </h2>
            {isFuture && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">未来日期</span>
            )}
          </div>

          {isFuture ? (
             <div className="text-center py-8 text-slate-400">
               <div className="mb-2 text-2xl">⏳</div>
               <p>时间还没到，请耐心等待这一天！</p>
               <p className="text-xs mt-2">您可以先查看下方的学习计划预习。</p>
             </div>
          ) : isCheckedIn ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HeartIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">已完成打卡</h3>
              <p className="text-slate-600 italic px-4 leading-relaxed">
                "{checkIns[selectedDateStr].quote}"
              </p>
              <div className="mt-4 text-sm text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-full">
                学习时长: {checkIns[selectedDateStr].hours} 小时
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  本日学习时长 (小时)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    placeholder="输入..."
                    className="w-full text-2xl font-semibold p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500 text-center text-medical-700 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    Hours
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  * 需满 3 小时才能点亮爱心
                </p>
              </div>
              
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                  loading
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-medical-600 text-white hover:bg-medical-700 hover:shadow-medical-500/30"
                }`}
              >
                {loading ? (
                  <span>生成鼓励中...</span>
                ) : (
                  <>
                    <span>确认打卡</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Study Plan - Dynamic based on selection */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all duration-300">
          <div className="flex flex-col mb-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="w-1 h-6 bg-blue-500 rounded-full mr-2"></span>
                学习计划
              </h2>
              <span className="text-xs text-slate-400">{selectedDateStr}</span>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg self-start">
              {studyPlan.phase}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-4 border-l-4 border-blue-400">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">核心重点</div>
            <div className="font-semibold text-slate-800 text-lg leading-tight">{studyPlan.focus}</div>
          </div>

          <ul className="space-y-4">
            {studyPlan.tasks.map((task, index) => (
              <li key={index} className="flex items-start group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-500 mt-0.5 mr-3 flex items-center justify-center text-xs font-bold border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <span className="text-slate-600 text-sm leading-relaxed pt-0.5">{task}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <footer className="text-center text-slate-400 text-xs pt-4 pb-8">
            罗丹，相信自己，你一定能行！
        </footer>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);