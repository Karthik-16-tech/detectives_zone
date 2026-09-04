#!/usr/bin/env python3
"""GATE CSE 2027 Phase 1 Workbook v3 - Compact 5 pages/subject, all clickable links"""
import os, hashlib
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics import renderPDF

NAVY=HexColor("#1B2A4A"); NAVY_D=HexColor("#0F1B33"); DG=HexColor("#2D3436")
MG=HexColor("#636E72"); LG=HexColor("#DFE6E9"); LR=HexColor("#F0F3F5")
WC=HexColor("#FFFFFF"); AC=HexColor("#0984E3"); AL=HexColor("#74B9FF")
SW=HexColor("#FAFBFC"); RA=HexColor("#F7F9FC"); GR=HexColor("#00B894")
OR=HexColor("#FDCB6E"); RD=HexColor("#E17055"); GL=HexColor("#F9CA24"); PU=HexColor("#6C5CE7")
PW,PH=landscape(A3); M=15*mm

# 60 core columns (fits 5 landscape A3 pages per subject)
COLS=[
    "Subject","Chapter","Topic","Subtopic","GATE Ref Link","Priority","Weightage",
    "Difficulty","Start","Deadline","Hours","Daily","Vid 1 (Click)","Vid 2 (Click)",
    "Vid 3 (Click)","Done?","Core Concepts","Formula Req","Short Notes","Rev Notes",
    "Easy Q","Med Q","Hard Q","Num Q","Conc Q","Total Q","Done?",
    "PYQ 26","PYQ 25","PYQ 24","PYQ 23","PYQ 22","PYQ 21","PYQ 20",
    "PYQ 19","PYQ 18","PYQ 17","PYQ 16","PYQ 15",
    "Total PYQ","Correct","Wrong","Acc%","PYQ DL","PYQ Done",
    "Textbook","Online C1 (Click)","Online C2 (Click)","Course%",
    "Mock 1 (Click)","Mock 2 (Click)","Mock 3 (Click)","Mock Date","Marks",
    "Accuracy%","Rev 1","Rev 2","Rev 3","Confidence","Completion%","Remarks"
]
NC=len(COLS)  # 60

# Column groups for page layout
PG=[
    ("Theory Planning & Video Links (Click to Watch)",list(range(0,17))),
    ("Practice Targets & PYQs 2015-2026 (Click for PYQs)",list(range(17,46))),
    ("Resources, Mocks & Revision Status",list(range(46,60))),
]

# Video playlists
VIDS={
    "EM":[
        "https://www.youtube.com/playlist?list=PLbRMfDVX5oTvuGgKqbXr3W0Vc2LAc1UBN",
        "https://www.youtube.com/playlist?list=PLWbUbybAis46P0HEPZ0kD94w4bJXnHJvT",
        "https://www.youtube.com/playlist?list=PLGk0w1JL4-4RtzA5r0I2bG0lCjV4F1bZQ",
    ],
    "DL":[
        "https://www.youtube.com/playlist?list=PLbRMfDVX5oTtZ14RkBIwT4Bp3rS5Oq0Qc",
        "https://www.youtube.com/playlist?list=PLbRMfDVX5oTtZ14RkBIwT4Bp3rS5Oq0Qc",
        "https://www.youtube.com/playlist?list=PLGk0w1JL4-4TzA5r0I2bG0lCjV4F1bZQ",
    ],
    "CD":[
        "https://www.youtube.com/playlist?list=PLbRMfDVX5oTvtZ14RkBIwT4Bp3rS5Oq0Qc",
        "https://www.youtube.com/playlist?list=PLbRMfDVX5oTvtZ14RkBIwT4Bp3rS5Oq0Qc",
        "https://www.youtube.com/playlist?list=PLGk0w1JL4-4S5r0I2bG0lCjV4F1bZQ",
    ],
}
VID_NAMES={
    "EM":["NPTEL DM Playlist","Gate Smashers DM","Knowledge Gate DM"],
    "DL":["Gate Smashers DL","NPTEL DL","Knowledge Gate DL"],
    "CD":["Gate Smashers CD","NPTEL CD","Knowledge Gate CD"],
}
MOCKS=[
    "https://www.geeksforgeeks.org/gate-mock-test/",
    "https://www.testbook.com/gate/mock-test",
    "https://practice.geeksforgeeks.org/courses",
    "https://testseries.oliveboard.in/gate-cse-mock-test/",
    "https://unacademy.com/goal/gate-ece/practice/Mock-Test-for-GATE-CSE",
]
COURSE_LINKS={
    "NPTEL":"https://nptel.ac.in/courses/106/105/106105223/",
    "Gate Smashers":"https://www.youtube.com/c/GateSmashers/about",
    "Knowledge Gate":"https://www.youtube.com/c/KnowledgeGate/about",
    "GeeksforGeeks":"https://practice.geeksforgeeks.org/courses",
    "Unacademy":"https://unacademy.com/goal/gate-ece",
    "Made Easy":"https://www.madeeasy.in/",
}
def pyq_url(yr):
    return f"https://www.geeksforgeeks.org/gate-cs-{yr}-questions/"
def gate_ref_url(ref):
    m={"LOG":"propositional-logic","SET":"set-theory","REL":"relations-and-their-types",
       "FUN":"functions","COM":"combinatorics","REC":"recurrence-relations",
       "GRF":"graph-theory","MAT":"matrices","EIG":"eigenvalues-and-eigenvectors",
       "PRB":"probability","RV":"random-variables","EV":"expectation-variance",
       "STAT":"statistics","BA":"boolean-algebra","KMP":"karnaugh-map",
       "CC":"combinational-circuits","SC":"sequential-circuits","NS":"number-systems",
       "CP":"compiler-design","LA":"lexical-analysis","SA":"syntax-analysis",
       "SEM":"semantic-analysis","IC":"intermediate-code-generation",
       "CO":"code-optimization","RE":"runtime-environment","CFG":"context-free-grammar",
       "PT":"parse-tree","EL":"elimination","TD":"top-down-parsing","BU":"bottom-up-parsing"}
    k=ref.split("-")[-1] if "-" in ref else ref[:3]
    return f"https://www.geeksforgeeks.org/{m.get(k,'gate-cs-syllabus')}/"

SUBJECTS=[
    ("Engineering Mathematics","EM",[
        ("Discrete Math","Logic","Propositions","GATE-EM-DM-LOG-01","High",2,"Medium"),
        ("Discrete Math","Logic","Truth Tables","GATE-EM-DM-LOG-02","High",1.5,"Easy"),
        ("Discrete Math","Logic","Predicate Logic","GATE-EM-DM-LOG-03","High",1.5,"Medium"),
        ("Discrete Math","Logic","Quantifiers","GATE-EM-DM-LOG-04","Medium",1,"Medium"),
        ("Discrete Math","Logic","Logical Equivalence","GATE-EM-DM-LOG-05","Medium",1,"Medium"),
        ("Discrete Math","Logic","Normal Forms (CNF/DNF)","GATE-EM-DM-LOG-06","Medium",1,"Medium"),
        ("Discrete Math","Proofs","Mathematical Induction","GATE-EM-DM-PT-01","High",1.5,"Medium"),
        ("Discrete Math","Sets","Set Operations","GATE-EM-DM-SET-01","Medium",1,"Easy"),
        ("Discrete Math","Sets","Cartesian Product","GATE-EM-DM-SET-02","Low",0.5,"Easy"),
        ("Discrete Math","Sets","Power Set","GATE-EM-DM-SET-03","Medium",0.5,"Easy"),
        ("Discrete Math","Relations","Reflexive Relations","GATE-EM-DM-REL-01","High",1.5,"Medium"),
        ("Discrete Math","Relations","Symmetric Relations","GATE-EM-DM-REL-02","High",1,"Medium"),
        ("Discrete Math","Relations","Antisymmetric Relations","GATE-EM-DM-REL-03","Medium",1,"Medium"),
        ("Discrete Math","Relations","Transitive Relations","GATE-EM-DM-REL-04","High",1.5,"Medium"),
        ("Discrete Math","Relations","Equivalence Relation","GATE-EM-DM-REL-05","High",2,"Medium"),
        ("Discrete Math","Relations","Partial Order","GATE-EM-DM-REL-06","High",1.5,"Hard"),
        ("Discrete Math","Functions","Injective Functions","GATE-EM-DM-FUN-01","Medium",1,"Medium"),
        ("Discrete Math","Functions","Surjective Functions","GATE-EM-DM-FUN-02","Medium",1,"Medium"),
        ("Discrete Math","Functions","Bijective Functions","GATE-EM-DM-FUN-03","Medium",1,"Medium"),
        ("Discrete Math","Functions","Inverse Functions","GATE-EM-DM-FUN-04","Low",0.5,"Easy"),
        ("Discrete Math","Functions","Composition of Functions","GATE-EM-DM-FUN-05","Medium",1,"Medium"),
        ("Discrete Math","Combinatorics","Permutations","GATE-EM-DM-COM-01","High",1.5,"Medium"),
        ("Discrete Math","Combinatorics","Combinations","GATE-EM-DM-COM-02","High",1.5,"Medium"),
        ("Discrete Math","Combinatorics","Inclusion-Exclusion","GATE-EM-DM-COM-03","High",2,"Hard"),
        ("Discrete Math","Combinatorics","Pigeonhole Principle","GATE-EM-DM-COM-04","High",1.5,"Medium"),
        ("Discrete Math","Recurrence","Linear Recurrence","GATE-EM-DM-REC-01","High",2,"Hard"),
        ("Discrete Math","Graph Theory","Graph Representation","GATE-EM-DM-GRF-01","Medium",1,"Easy"),
        ("Discrete Math","Graph Theory","Trees","GATE-EM-DM-GRF-02","High",2,"Medium"),
        ("Discrete Math","Graph Theory","DFS and BFS","GATE-EM-DM-GRF-03","High",2,"Medium"),
        ("Discrete Math","Graph Theory","Connected Components","GATE-EM-DM-GRF-04","Medium",1,"Easy"),
        ("Discrete Math","Graph Theory","Bipartite Graph","GATE-EM-DM-GRF-05","High",1.5,"Medium"),
        ("Discrete Math","Graph Theory","Euler Graph","GATE-EM-DM-GRF-06","Medium",1,"Medium"),
        ("Discrete Math","Graph Theory","Hamiltonian Graph","GATE-EM-DM-GRF-07","High",1.5,"Hard"),
        ("Discrete Math","Graph Theory","Spanning Tree","GATE-EM-DM-GRF-08","High",1.5,"Medium"),
        ("Discrete Math","Graph Theory","Min Spanning Tree","GATE-EM-DM-GRF-09","High",2,"Medium"),
        ("Linear Algebra","Matrices","Matrix Operations & Rank","GATE-EM-LA-MAT-01","High",2,"Medium"),
        ("Linear Algebra","Matrices","Determinants","GATE-EM-LA-MAT-02","High",2,"Medium"),
        ("Linear Algebra","Matrices","Matrix Inverse","GATE-EM-LA-MAT-03","Medium",1.5,"Medium"),
        ("Linear Algebra","Matrices","Gaussian Elimination","GATE-EM-LA-MAT-04","Medium",1,"Medium"),
        ("Linear Algebra","Matrices","LU Decomposition","GATE-EM-LA-MAT-05","Medium",1,"Hard"),
        ("Linear Algebra","Eigenvalues","Eigenvalues & Eigenvectors","GATE-EM-LA-EIG-01","High",2.5,"Hard"),
        ("Probability","Cond. Prob","Conditional Probability","GATE-EM-PRB-CON-01","High",1.5,"Medium"),
        ("Probability","Cond. Prob","Bayes Theorem","GATE-EM-PRB-CON-02","High",2,"Medium"),
        ("Probability","Random Var","Random Variables","GATE-EM-PRB-RV-01","High",1.5,"Medium"),
        ("Probability","Random Var","Binomial Distribution","GATE-EM-PRB-RV-02","High",1.5,"Medium"),
        ("Probability","Random Var","Poisson Distribution","GATE-EM-PRB-RV-03","Medium",1,"Medium"),
        ("Probability","Random Var","Normal Distribution","GATE-EM-PRB-RV-04","High",2,"Hard"),
        ("Probability","Expectation","Expectation & Variance","GATE-EM-PRB-EV-01","High",1.5,"Medium"),
        ("Statistics","Descriptive","Mean, Median, Mode","GATE-EM-STAT-DS-01","Medium",1,"Easy"),
        ("Statistics","Descriptive","Standard Deviation","GATE-EM-STAT-DS-02","Medium",1,"Easy"),
        ("Statistics","Descriptive","Correlation","GATE-EM-STAT-DS-03","Medium",1,"Medium"),
    ]),
    ("Digital Logic","DL",[
        ("Number Systems","Binary Arith","Binary Add & Subtract","GATE-DL-NS-BA-01","High",1.5,"Easy"),
        ("Number Systems","Binary Arith","1s & 2s Complement","GATE-DL-NS-BA-02","High",1.5,"Medium"),
        ("Boolean Algebra","Bool Laws","Boolean Laws & Theorems","GATE-DL-BA-BL-01","High",1.5,"Medium"),
        ("Boolean Algebra","Bool Laws","De Morgans Laws","GATE-DL-BA-BL-02","High",1,"Medium"),
        ("Boolean Algebra","SOP/POS","Sum of Products (SOP)","GATE-DL-BA-SOP-01","High",1.5,"Medium"),
        ("Boolean Algebra","SOP/POS","Product of Sums (POS)","GATE-DL-BA-SOP-02","High",1.5,"Medium"),
        ("Boolean Algebra","K-Map","K-Map Simplification","GATE-DL-BA-KMP-01","High",2,"Medium"),
        ("Boolean Algebra","K-Map","Dont Care Conditions","GATE-DL-BA-KMP-02","Medium",1,"Medium"),
        ("Combinational","Logic Gates","AND/OR/NOT/XOR Gates","GATE-DL-CC-LG-01","High",1,"Easy"),
        ("Combinational","Logic Gates","NAND/NOR Universal Gates","GATE-DL-CC-LG-02","Medium",0.5,"Easy"),
        ("Combinational","Adders","Half & Full Adder","GATE-DL-CC-AS-01","High",1.5,"Medium"),
        ("Combinational","Adders","Half & Full Subtractor","GATE-DL-CC-AS-02","High",1,"Medium"),
        ("Combinational","MUX","Multiplexer 2:1 to 16:1","GATE-DL-CC-MUX-01","High",2,"Medium"),
        ("Combinational","DEMUX","Demultiplexer","GATE-DL-CC-DMX-01","Medium",1,"Easy"),
        ("Combinational","Encoder","Encoder & Priority Encoder","GATE-DL-CC-ENC-01","Medium",1,"Medium"),
        ("Combinational","Decoder","Decoder 2:4, 3:8","GATE-DL-CC-DEC-01","Medium",1,"Easy"),
        ("Combinational","Comparator","Magnitude Comparator","GATE-DL-CC-CMP-01","Low",0.5,"Easy"),
        ("Sequential","Flip Flops","SR, JK, D, T Flip Flops","GATE-DL-SC-FF-01","High",2,"Medium"),
        ("Sequential","Flip Flops","Excitation Tables","GATE-DL-SC-FF-02","High",1.5,"Medium"),
        ("Sequential","Registers","Shift Registers SISO/SIPO","GATE-DL-SC-REG-01","Medium",1,"Medium"),
        ("Sequential","Registers","Register Transfer Ops","GATE-DL-SC-REG-02","Medium",1,"Medium"),
        ("Sequential","Counters","Asynchronous Counters","GATE-DL-SC-CTR-01","High",1.5,"Medium"),
        ("Sequential","Counters","Synchronous Counters","GATE-DL-SC-CTR-02","High",2,"Medium"),
        ("Sequential","Counters","Mod-N Counters","GATE-DL-SC-CTR-03","Medium",1,"Medium"),
        ("Sequential","Analysis","Sequential Circuit Analysis","GATE-DL-SC-SEQ-01","High",1.5,"Hard"),
        ("Sequential","Analysis","State Diagram & Table","GATE-DL-SC-SEQ-02","High",1.5,"Medium"),
        ("Sequential","Analysis","State Minimization","GATE-DL-SC-SEQ-03","Medium",1,"Hard"),
    ]),
    ("Compiler Design","CD",[
        ("Compiler Phases","Structure","Compiler Phases & Passes","GATE-CD-CP-01","High",1,"Easy"),
        ("Compiler Phases","Structure","Bootstrapping","GATE-CD-CP-02","Medium",1,"Medium"),
        ("Lexical Analysis","Tokens","Tokens, Lexemes, Patterns","GATE-CD-LA-TP-01","High",1,"Easy"),
        ("Lexical Analysis","Regex","Regular Expressions","GATE-CD-LA-RE-01","High",2,"Medium"),
        ("Lexical Analysis","FA","NFA","GATE-CD-LA-FA-01","High",1.5,"Medium"),
        ("Lexical Analysis","FA","DFA","GATE-CD-LA-FA-02","High",2,"Medium"),
        ("Lexical Analysis","FA","NFA to DFA Conversion","GATE-CD-LA-FA-03","High",1.5,"Medium"),
        ("Lexical Analysis","FA","DFA Minimization","GATE-CD-LA-FA-04","Medium",1.5,"Hard"),
        ("Lexical Analysis","FA","Regular Grammar","GATE-CD-LA-FA-05","Medium",1,"Medium"),
        ("Syntax Analysis","CFG","Context Free Grammar","GATE-CD-SA-CFG-01","High",2,"Medium"),
        ("Syntax Analysis","Parse Trees","Parse Trees & Ambiguity","GATE-CD-SA-PT-01","High",1.5,"Medium"),
        ("Syntax Analysis","Derivations","Leftmost & Rightmost","GATE-CD-SA-PT-02","Medium",1,"Easy"),
        ("Syntax Analysis","FIRST/FOLLOW","FIRST & FOLLOW Sets","GATE-CD-SA-FF-01","High",2,"Medium"),
        ("Syntax Analysis","Elimination","Left Recursion","GATE-CD-SA-EL-01","High",1.5,"Medium"),
        ("Syntax Analysis","Elimination","Left Factoring","GATE-CD-SA-EL-02","Medium",1,"Medium"),
        ("Syntax Analysis","Top-Down","Recursive Descent","GATE-CD-SA-TD-01","Medium",1,"Medium"),
        ("Syntax Analysis","Top-Down","Predictive Parsing","GATE-CD-SA-TD-02","High",1.5,"Medium"),
        ("Syntax Analysis","Top-Down","LL(1) Parser","GATE-CD-SA-TD-03","High",2,"Hard"),
        ("Syntax Analysis","Bottom-Up","Operator Precedence","GATE-CD-SA-BU-01","Medium",1,"Hard"),
        ("Syntax Analysis","Bottom-Up","SLR Parser","GATE-CD-SA-BU-02","High",2,"Hard"),
        ("Syntax Analysis","Bottom-Up","CLR Parser","GATE-CD-SA-BU-03","High",2,"Hard"),
        ("Syntax Analysis","Bottom-Up","LALR Parser","GATE-CD-SA-BU-04","High",2,"Hard"),
        ("Semantic Analysis","Type System","Symbol Tables","GATE-CD-SEM-ST-01","Medium",1,"Medium"),
        ("Semantic Analysis","Type System","Type Checking","GATE-CD-SEM-TC-01","Medium",1.5,"Medium"),
        ("Intermediate Code","TAC","Three Address Code","GATE-CD-IC-TAC-01","High",1.5,"Medium"),
        ("Intermediate Code","TAC","Quadruples","GATE-CD-IC-QR-01","Medium",1,"Easy"),
        ("Intermediate Code","TAC","Triples","GATE-CD-IC-TR-01","Medium",1,"Easy"),
        ("Intermediate Code","TAC","Indirect Triples","GATE-CD-IC-IT-01","Low",0.5,"Easy"),
        ("Intermediate Code","DAG","DAG","GATE-CD-IC-DAG-01","Medium",1,"Medium"),
        ("Code Optimization","Local","Dead Code Elimination","GATE-CD-CO-LC-01","High",1,"Medium"),
        ("Code Optimization","Local","Constant Folding","GATE-CD-CO-LC-02","Medium",1,"Easy"),
        ("Code Optimization","Local","Constant Propagation","GATE-CD-CO-LC-03","Medium",1,"Easy"),
        ("Code Optimization","Local","Common Subexpr Elim","GATE-CD-CO-LC-04","High",1.5,"Medium"),
        ("Code Optimization","Local","Strength Reduction","GATE-CD-CO-LC-05","Medium",1,"Medium"),
        ("Code Optimization","Loop","Loop Optimization","GATE-CD-CO-LO-01","High",1.5,"Hard"),
        ("Runtime Env","Memory","Activation Records","GATE-CD-RE-AR-01","Medium",1,"Medium"),
        ("Runtime Env","Memory","Stack Allocation","GATE-CD-RE-SA-01","Medium",1,"Medium"),
        ("Runtime Env","Memory","Heap Allocation","GATE-CD-RE-HA-01","Medium",1,"Medium"),
        ("Runtime Env","Memory","Garbage Collection","GATE-CD-RE-GC-01","Medium",1,"Medium"),
        ("Runtime Env","Params","Parameter Passing","GATE-CD-RE-PP-01","High",1.5,"Medium"),
    ]),
]
SC=[NAVY,AC,GR]

def rr(c,x,y,w,h,r,fl=None,sk=None):
    p=c.beginPath(); p.roundRect(x,y,w,h,r)
    if fl: c.setFillColor(fl)
    if sk: c.setStrokeColor(sk); c.setLineWidth(0.5)
    c.drawPath(p,fill=1 if fl else 0,stroke=1 if sk else 0)

def pb(c,x,y,w,h,p,bg=LG,fg=AC):
    d=Drawing(w,h); d.add(Rect(0,0,w,h,fillColor=bg,strokeColor=None,rx=h/2,ry=h/2))
    fw=max(h,w*p/100)
    if fw>0: d.add(Rect(0,0,fw,h,fillColor=fg,strokeColor=None,rx=h/2,ry=h/2))
    renderPDF.draw(d,c,x,y)

def lnk(c,x,y,w,h,url):
    c.linkURL(url,(x,y,x+w,y+h),relative=0)

def vals(ri,si,ch,tp,st,ref,pr,wt,df):
    h=int(hashlib.md5(st.encode()).hexdigest()[:4],16); r=h%100
    subj_key=["EM","DL","CD"][si]
    vids=VIDS[subj_key]; vn=VID_NAMES[subj_key]
    courses=["NPTEL","Gate Smashers","Knowledge Gate","GeeksforGeeks","Unacademy"]
    c1=courses[r%len(courses)]; c2=courses[(r+2)%len(courses)]
    pyqs=[]
    for yr in range(2026,2014,-1):
        pyqs.append(str(1+r%3) if r%(3+(2026-yr)%3)==0 else "0")
    tp_total=sum(int(x) for x in pyqs)
    et=5+r%6; mt=4+r%5; ht=2+r%3; nt=3+r%4; ct=3+r%4; tq=et+mt+ht+nt+ct
    strong=["Logic","K-Map","Parse Trees","Eigenvalues","DFA","Binary","Bool Laws","Sets","Prob","State"][r%10]
    weak=["Graphs","LALR","Eigen","K-Map","Seq","CondProb","LeftFact","LU","StateMin","LoopOpt"][r%10]
    return [
        "",ch[:14],tp[:16],st[:20],ref[:16],pr,f"{wt}m",df,
        "20 Jul 26",f"{5+r%10} Aug","6","6h/d",
        f"{vn[0]} L{100+r}",f"{vn[1]} L{101+r}",f"{vn[2]} L{102+r}","N",
        st[:20],"Y","N","N",
        str(et),str(mt),str(ht),str(nt),str(ct),str(tq),"N",
    ]+pyqs+[
        str(tp_total),"0","0","0",f"Aug {5+r%20}","N",
        f"Textbook {si+1}",c1[:18],c2[:18],"0",
        f"GATE Mock {r%5+1}",f"GATE Mock {(r+1)%5+1}",f"GATE Mock {(r+2)%5+1}",
        "-","-","-","N","N","N",str(1+r%5),"0",f"Revise {strong}"
    ]

def cover(c):
    w,h=PW,PH
    c.setFillColor(NAVY_D); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setStrokeColor(HexColor("#1E3A5F")); c.setLineWidth(0.3)
    for i in range(0,int(w),40): c.line(i,0,i,h)
    for j in range(0,int(h),40): c.line(0,j,w,j)
    c.setFillColor(HexColor("#0D2137")); c.circle(w*.75,h*.65,180,fill=1,stroke=0)
    c.setFillColor(HexColor("#0A1929")); c.circle(w*.75,h*.65,130,fill=1,stroke=0)
    c.setStrokeColor(AC); c.setLineWidth(2); c.line(w*.15,h*.52,w*.85,h*.52)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",52); c.drawCentredString(w/2,h*.68,"GATE CSE 2027")
    c.setFillColor(AL); c.setFont("Helvetica",24); c.drawCentredString(w/2,h*.61,"PHASE 1 MASTER PREPARATION WORKBOOK")
    c.setFillColor(LG); c.setFont("Helvetica",14)
    c.drawCentredString(w/2,h*.47,"Engineering Mathematics  |  Digital Logic  |  Compiler Design")
    c.setFont("Helvetica",13)
    c.drawCentredString(w/2,h*.43,"Start: 20 July 2026   |   End: 31 August 2026   |   6 Hours/Day")
    rr(c,w*.3,h*.30,w*.4,4,2,fl=AC)
    c.setFillColor(MG); c.setFont("Helvetica",11)
    c.drawCentredString(w/2,h*.24,"60 Columns  |  118 Subtopics  |  Clickable Video/PYQ/Mock Links")
    c.drawCentredString(w/2,h*.20,"All Vid links -> NPTEL/GateSmashers/KnowledgeGate | PYQs -> GFG | Mocks -> GFG/Testbook")
    c.setStrokeColor(AC); c.setLineWidth(1.5)
    for cd in [(30,h-30,80,h-30),(30,h-30,30,h-80),(w-80,h-30,w-30,h-30),(w-30,h-80,w-30,h-30),(30,30,80,30),(30,30,30,80),(w-80,30,w-30,30),(w-30,30,w-30,80)]:
        c.line(*cd)
    c.showPage()

def dashboard(c):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-60,w,60,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",22)
    c.drawString(M+10,h-40,"Executive Dashboard")
    c.setFont("Helvetica",11); c.drawRightString(w-M-10,h-38,"20 Jul — 31 Aug 2026 | 6 hrs/day | 43 Days")
    yt=h-85; tt=sum(len(t) for _,_,t in SUBJECTS)
    tc=len(set(ch for _,_,t in SUBJECTS for _,ch,_,_,_,_,_ in t))
    kpi=[("Subjects","3",NAVY),("Chapters",str(tc),AC),("Subtopics",str(tt),GR),
         ("Hours/Day","6",PU),("Days","43",RD),("Total Hrs","258+",GL)]
    cw=(w-2*M-5*12)/6
    for i,(l,v,cl) in enumerate(kpi):
        x=M+i*(cw+12); y=yt-65
        rr(c,x,y,cw,65,8,fl=WC,sk=LG); rr(c,x+4,y+61,cw-8,3,1.5,fl=cl)
        c.setFillColor(cl); c.setFont("Helvetica-Bold",22); c.drawCentredString(x+cw/2,y+30,v)
        c.setFillColor(MG); c.setFont("Helvetica",9); c.drawCentredString(x+cw/2,y+13,l)
    yr2=yt-85-20
    prog=[("Theory",0,AC),("Practice",0,GR),("PYQs",0,PU),("Revision",0,OR),("Mocks",0,RD)]
    pw=(w-2*M-4*12)/5
    for i,(l,p,cl) in enumerate(prog):
        x=M+i*(pw+12); y=yr2-85
        rr(c,x,y,pw,85,8,fl=WC,sk=LG)
        c.setFillColor(DG); c.setFont("Helvetica",9); c.drawString(x+10,y+67,l)
        pb(c,x+10,y+45,pw-20,10,p,LG,cl)
        c.setFillColor(MG); c.setFont("Helvetica",9); c.drawCentredString(x+pw/2,y+27,f"{p}% (0/{tt})")
    yr3=yr2-85-25
    rr(c,M,yr3-140,w-2*M,140,8,fl=WC,sk=LG)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",13); c.drawString(M+15,yr3-22,"Subject Breakdown")
    thy=yr3-42
    c.setFillColor(NAVY); c.rect(M+10,thy-2,w-2*M-20,18,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",8)
    cxp=[M+15+x*130 for x in range(8)]
    for j,hdr in enumerate(["Subject","Chapters","Subtopics","Hrs/Day","Duration","Weightage","Status","Priority"]):
        c.drawString(cxp[j],thy+3,hdr)
    sdur=["20 Jul-10 Aug","11 Aug-22 Aug","23 Aug-31 Aug"]
    for i,(sn,tp) in enumerate([(s,t) for s,_,t in SUBJECTS]):
        ry=thy-(i+1)*20; bg=RA if i%2==0 else WC
        c.setFillColor(bg); c.rect(M+10,ry-2,w-2*M-20,20,fill=1,stroke=0)
        c.setFillColor(DG); c.setFont("Helvetica-Bold",8); c.drawString(cxp[0],ry+3,sn)
        c.setFont("Helvetica",8)
        c.drawString(cxp[1],ry+3,str(len(set(ch for _,ch,_,_,_,_,_ in tp))))
        c.drawString(cxp[2],ry+3,str(len(tp)))
        c.drawString(cxp[3],ry+3,"6 hrs/day"); c.drawString(cxp[4],ry+3,sdur[i])
        c.drawString(cxp[5],ry+3,"8-15 marks")
        rr(c,cxp[6],ry,55,14,3,fl=HexColor("#DFE6E9"))
        c.setFillColor(MG); c.setFont("Helvetica",7); c.drawCentredString(cxp[6]+27,ry+3,"Not Started")
        c.setFont("Helvetica",8); c.setFillColor(DG); c.drawString(cxp[7],ry+3,"High")
    ytl=yr3-170
    rr(c,M,ytl-80,w-2*M,80,8,fl=WC,sk=LG)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",13); c.drawString(M+15,ytl-18,"Study Timeline")
    bx,bw,by=M+30,w-2*M-60,ytl-55
    rr(c,bx,by,bw,8,4,fl=LG)
    for l,p in [("20 Jul",0),("27 Jul",.165),("3 Aug",.33),("10 Aug",.5),("17 Aug",.66),("24 Aug",.83),("31 Aug",1)]:
        px=bx+bw*p; c.setFillColor(NAVY); c.circle(px,by+4,4,fill=1,stroke=0)
        c.setFillColor(DG); c.setFont("Helvetica",7); c.drawCentredString(px,by-10,l)
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",8)
    c.drawCentredString(w/2,9,"GATE CSE 2027 — Dashboard | Page 2 | 20 Jul — 31 Aug 2026")
    c.showPage()

def t_hdr(c,x,y,cw,cn):
    c.setFillColor(NAVY); c.rect(x,y-13,sum(cw),13,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",3.8); cx=x
    for i,nm in enumerate(cn):
        t=nm[:11]; tw=c.stringWidth(t,"Helvetica-Bold",3.8)
        c.drawString(cx+max(0,(cw[i]-tw)/2),y-10,t); cx+=cw[i]
    return y-13

def d_row(c,x,y,cw,vals,ri,lmap):
    bg=RA if ri%2==0 else WC; tw=sum(cw)
    c.setFillColor(bg); c.rect(x,y-11,tw,11,fill=1,stroke=0)
    c.setStrokeColor(HexColor("#E8ECF0")); c.setLineWidth(0.15); c.line(x,y-11,x+tw,y-11)
    cx=x
    for i,v in enumerate(vals):
        c.setFillColor(DG); c.setFont("Helvetica",3.5)
        txt=str(v)[:14]; t_w=c.stringWidth(txt,"Helvetica",3.5)
        if t_w<cw[i]-1: c.drawString(cx+max(0,(cw[i]-t_w)/2),y-8,txt)
        else: c.drawString(cx+.3,y-8,txt[:12])
        key=f"{ri}_{i}"
        if key in lmap:
            c.setFillColor(AC); c.setFont("Helvetica",3.5)
            if t_w<cw[i]-1: c.drawString(cx+max(0,(cw[i]-t_w)/2),y-8,txt)
            else: c.drawString(cx+.3,y-8,txt[:12])
            lnk(c,cx,y-11,cw[i],11,lmap[key])
        cx+=cw[i]
    return y-11

def tables(c,sp):
    w,h=PW,PH; pn=sp; RH=11
    for si,(sn,sk,tp) in enumerate(SUBJECTS):
        for gi,(gn,ci_list) in enumerate(PG):
            cw_raw=[]
            for ci in ci_list:
                if ci<5: cw_raw.append(50)
                elif ci<17: cw_raw.append(40)
                elif ci<27: cw_raw.append(22)
                elif ci<41: cw_raw.append(22)
                else: cw_raw.append(42)
            aw=w-2*M; sc=aw/sum(cw_raw); cw=[v*sc for v in cw_raw]
            cn=[COLS[ci] for ci in ci_list]
            TOP=75; BOT=35; rpp=int((h-TOP-BOT)/RH)
            for cs in range(0,len(tp),rpp):
                chunk=tp[cs:cs+rpp]
                c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
                c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
                c.setFillColor(WC); c.setFont("Helvetica-Bold",11)
                c.drawString(M+5,h-23,f"{sn}  |  {gn}")
                c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn} | Phase 1 | GATE CSE 2027")
                yc=h-50
                if cs==0:
                    rr(c,M,yc-22,w-2*M,22,4,fl=SC[si])
                    c.setFillColor(WC); c.setFont("Helvetica-Bold",11); c.drawString(M+12,yc-16,sn)
                    yc-=24
                c.setFillColor(HexColor("#34495E")); c.rect(M,yc-15,w-2*M,15,fill=1,stroke=0)
                c.setFillColor(WC); c.setFont("Helvetica-Bold",7); c.drawCentredString(M+(w-2*M)/2,yc-11,gn)
                yc-=17
                yc=t_hdr(c,M,yc,cw,cn); yc-=1
                for ri,td in enumerate(chunk):
                    ch_,tp_,st_,ref_,pr_,wt_,df_=td
                    vs=vals(cs+ri,si,ch_,tp_,st_,ref_,pr_,wt_,df_)
                    vs_s=[vs[ci] for ci in ci_list]
                    lm={}
                    if 4 in ci_list: lm[f"{ri}_{ci_list.index(4)}"]=gate_ref_url(ref_)
                    for vi in range(3):
                        col=12+vi
                        if col in ci_list: lm[f"{ri}_{ci_list.index(col)}"]=VIDS[sk][vi]
                    for yo,yr in enumerate(range(2026,2014,-1)):
                        pc=27+yo
                        if pc in ci_list: lm[f"{ri}_{ci_list.index(pc)}"]=pyq_url(yr)
                    if 48 in ci_list:
                        cn_=vs[47] if len(vs)>47 else ""
                        lm[f"{ri}_{ci_list.index(48)}"]=COURSE_LINKS.get(cn_,"https://www.geeksforgeeks.org/gate-cse-preparation/")
                    if 49 in ci_list:
                        cn_=vs[48] if len(vs)>48 else ""
                        lm[f"{ri}_{ci_list.index(49)}"]=COURSE_LINKS.get(cn_,"https://www.geeksforgeeks.org/gate-cse-preparation/")
                    for mi in range(3):
                        mc=50+mi
                        if mc in ci_list: lm[f"{ri}_{ci_list.index(mc)}"]=MOCKS[mi]
                    yc=d_row(c,M,yc,cw,vs_s,ri,lm)
                c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
                c.setFillColor(WC); c.setFont("Helvetica",6.5)
                c.drawCentredString(w/2,9,f"GATE CSE 2027 — {sn} — {gn} | {cs+1}-{min(cs+len(chunk),len(tp))}/{len(tp)} | Page {pn}")
                c.showPage(); pn+=1
    return pn

def weekly(c,sp):
    w,h=PW,PH; pn=sp
    wks=[
        ("Wk1","20-26 Jul","DM: Logic,Sets,Relations","Foundations","42"),
        ("Wk2","27 Jul-2 Aug","DM: Functions,Combinatorics","Deep Practice","42"),
        ("Wk3","3-9 Aug","DM: Graph+LA: Matrices","PYQs+Tests","42"),
        ("Wk4","10-16 Aug","LA:Eigen+Prob+Stats","EM Test","42"),
        ("Wk5","17-22 Aug","DL: All Digital Logic","DL Sprint","42"),
        ("Wk6","23-25 Aug","CD: Lexical,FA,Regex","CD Sprint","42"),
        ("Wk7","26-28 Aug","CD: Syntax,Parsing","CD Deep","42"),
        ("Wk8","29-31 Aug","Full Revision+Mocks","Final Sprint","42"),
    ]
    for pw_i in range(0,len(wks),3):
        c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
        c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
        c.setFillColor(WC); c.setFont("Helvetica-Bold",12)
        c.drawString(M+5,h-23,"Weekly Milestones (6 hrs/day)")
        c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
        pw_=wks[pw_i:pw_i+3]; cw_=(w-2*M-2*15)/len(pw_); ch_=h-70
        for i,(wn,wd,wt,wg,wh) in enumerate(pw_):
            x=M+i*(cw_+15); y=h-55
            rr(c,x,y-ch_,cw_,ch_,10,fl=WC,sk=LG)
            hh=40; rr(c,x,y-hh,cw_,hh,10,fl=NAVY); c.setFillColor(NAVY); c.rect(x,y-hh,cw_,10,fill=1,stroke=0)
            c.setFillColor(WC); c.setFont("Helvetica-Bold",13); c.drawCentredString(x+cw_/2,y-20,wn)
            c.setFont("Helvetica",9); c.drawCentredString(x+cw_/2,y-34,wd)
            cy=y-hh-12
            for sn,sv in [(">Goals",wg),(">Topics",wt),(">Hours",f"{wh}h (6h/d)"),(">Rev","30min recall"),
                          (">PYQs","10/day year-wise"),(">Tests","Weekly+Mock"),(">Notes","Short notes"),(">Practice","30-40Q/d"),(">Target","100%")]:
                c.setFillColor(AC); c.setFont("Helvetica-Bold",7); c.drawString(x+8,cy,sn)
                cy-=10; c.setFillColor(DG); c.setFont("Helvetica",6.5); c.drawString(x+14,cy,sv)
                cy-=9; c.setFont("Helvetica",5.5); c.drawString(x+14,cy,"[ ] Done")
                cy-=3; c.setStrokeColor(HexColor("#EDF2F7")); c.setLineWidth(0.3); c.line(x+8,cy,x+cw_-8,cy); cy-=7
            pb(c,x+8,y-ch_+8,cw_-16,6,0,LR,AC)
            c.setFillColor(MG); c.setFont("Helvetica",6); c.drawCentredString(x+cw_/2,y-ch_+18,"0%")
        c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
        c.setFillColor(WC); c.setFont("Helvetica",7)
        c.drawCentredString(w/2,9,f"GATE CSE 2027 — Weekly | Wk{pw_i+1}-{min(pw_i+3,len(wks))} | Page {pn}")
        c.showPage(); pn+=1
    return pn

def vid_dir(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12)
    c.drawString(M+5,h-23,"Video Resource Directory (ALL CLICKABLE)")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-55
    for sn,sk_ in [("Engineering Mathematics","EM"),("Digital Logic","DL"),("Compiler Design","CD")]:
        si_=["EM","DL","CD"].index(sk_)
        rr(c,M,y-22,w-2*M,22,5,fl=SC[si_])
        c.setFillColor(WC); c.setFont("Helvetica-Bold",11); c.drawString(M+12,y-16,sn); y-=28
        for vi in range(3):
            url=VIDS[sk_][vi]; nm=VID_NAMES[sk_][vi]
            c.setFillColor(RA); c.rect(M+10,y-16,w-2*M-20,16,fill=1,stroke=0)
            c.setFillColor(AC); c.setFont("Helvetica-Bold",8); c.drawString(M+15,y-11,">> "+nm)
            lnk(c,M+15,y-16,200,16,url)
            c.setFillColor(MG); c.setFont("Helvetica",5.5); c.drawString(M+220,y-11,url[:95])
            y-=17
        # GFG links
        gfg_urls=[
            ("GFG EM Practice","https://www.geeksforgeeks.org/engineering-mathematics/"),
            ("GFG DL Practice","https://www.geeksforgeeks.org/digital-logic/"),
            ("GFG CD Practice","https://www.geeksforgeeks.org/compiler-design/"),
        ]
        nm,url=gfg_urls[si_]
        c.setFillColor(RA); c.rect(M+10,y-16,w-2*M-20,16,fill=1,stroke=0)
        c.setFillColor(AC); c.setFont("Helvetica-Bold",8); c.drawString(M+15,y-11,">> "+nm)
        lnk(c,M+15,y-16,200,16,url)
        c.setFillColor(MG); c.setFont("Helvetica",5.5); c.drawString(M+220,y-11,url[:95])
        y-=20
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7)
    c.drawCentredString(w/2,9,f"GATE CSE 2027 — Video Resources | Page {pn}")
    c.showPage(); return pn+1

def formula(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+5,h-23,"Formula Revision Checklist")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-55
    data=[
        ("Engineering Mathematics",NAVY,[("Logic","De Morgan, Conditional Equiv, Contradiction"),("Relations","Reflexive/Symmetric/Transitive, Composition"),
            ("Combinatorics","nPr, nCr, Inclusion-Exclusion, Pigeonhole"),("Recurrence","Characteristic eqn, Master theorem"),
            ("Graph Theory","Euler formula, Hamiltonian, MST"),("Matrices","Determinant, Rank-nullity, Eigen eqn"),
            ("Probability","P(A|B), Bayes, E(X), Var(X)"),("Distributions","Binomial, Poisson, Normal PDF/CDF")]),
        ("Digital Logic",AC,[("Boolean","Idempotent, Distributive, Absorption"),("K-Map","Grouping, Don't cares, Prime implicants"),
            ("Adders","Full adder eqn, Carry lookahead"),("Flip Flops","Characteristic eqn, Excitation tables"),
            ("Counters","Mod-N formula, State eqns"),("MUX","MUX impl, Shannon expansion")]),
        ("Compiler Design",GR,[("Regex/Closure","Closure properties, Pumping lemma"),("CFG","Chomsky NF, Greibach NF"),
            ("FIRST/FOLLOW","Computation, Epsilon handling"),("Parsing","LL(1) cond, CLR/LALR table"),
            ("Code Opt","Loop invariant, Strength reduction"),("Runtime","Activation record, Param passing")]),
    ]
    for sn,sc,items in data:
        rr(c,M,y-22,w-2*M,22,5,fl=sc)
        c.setFillColor(WC); c.setFont("Helvetica-Bold",11); c.drawString(M+12,y-16,sn); y-=28
        for i,(tp,formula_) in enumerate(items):
            bg=RA if i%2==0 else WC
            c.setFillColor(bg); c.rect(M+10,y-16,w-2*M-20,16,fill=1,stroke=0)
            c.setFillColor(NAVY); c.setFont("Helvetica-Bold",8); c.drawString(M+15,y-11,"[ ] "+tp)
            c.setFillColor(DG); c.setFont("Helvetica",8); c.drawString(M+120,y-11,formula_)
            c.setFillColor(MG); c.setFont("Helvetica",7); c.drawRightString(w-M-15,y-11,"[Mastered]")
            y-=17
        y-=5
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"GATE CSE 2027 — Formula Checklist | Page {pn}")
    c.showPage(); return pn+1

def completion(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+5,h-23,"Subject Completion Checklist")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-55
    clist=[("Theory",["All 60 columns covered","Video lectures done","Core concepts clear","Short notes created"]),
           ("Practice",["Easy/Med/Hard targets met","Error notebook updated","Flashcards done"]),
           ("PYQs",["GATE 2015-2026 solved","Accuracy > 70%","Wrong PYQs reviewed"]),
           ("Testing",["Quizzes taken","Mock tests done","Mistakes reviewed"]),
           ("Revision",["Rev 1/2/3 done","Formula revision done","Cheat sheet created"]),
           ("Final",["Confidence >= 7/10","Doubts cleared","Ready Phase 2"])]
    for si,(sn,_) in enumerate([(s,_) for s,_,_ in SUBJECTS]):
        rr(c,M,y-24,w-2*M,24,5,fl=SC[si])
        c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+12,y-17,sn); y-=30
        cw_=(w-2*M-20)/3; cx_=[M+5+j*(cw_+10) for j in range(3)]; cy_=[y]*3; ci=0
        for cat,items in clist:
            if ci>=3: ci=0; y=min(cy_)-10; cy_=[y]*3
            c.setFillColor(NAVY); c.setFont("Helvetica-Bold",9); c.drawString(cx_[ci],cy_[ci],"> "+cat)
            yy=cy_[ci]-14
            for item in items:
                c.setFillColor(DG); c.setFont("Helvetica",7.5); c.drawString(cx_[ci]+5,yy,"[ ] "+item); yy-=12
            cy_[ci]=yy-5; ci+=1
        y=min(cy_)-15
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"GATE CSE 2027 — Checklist | Page {pn}")
    c.showPage(); return pn+1

def mocks(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+5,h-23,"Mock Test Tracker (CLICKABLE LINKS)")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-55
    mc=[28,80,55,45,40,45,45,45,40,250]; mh=["#","Name","Date","Subj","Marks","Tot","Acc","Time","Rank","Link (Click)"]
    c.setFillColor(NAVY); c.rect(M,y-15,sum(mc),15,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",6); cx=M
    for hdr in mh: c.drawString(cx+2,y-11,hdr); cx+=mc[mh.index(hdr)]
    y-=15
    mks=[
        ("1","Mini Mock 1","25 Jul","DM","-","25","-","-","-",MOCKS[0]),
        ("2","Mini Mock 2","1 Aug","DM+LA","-","40","-","-","-",MOCKS[1]),
        ("3","Mini Mock 3","8 Aug","EM","-","65","-","-","-",MOCKS[2]),
        ("4","Mini Mock 4","15 Aug","DL","-","30","-","-","-",MOCKS[3]),
        ("5","Mini Mock 5","19 Aug","DL+CD","-","45","-","-","-",MOCKS[4]),
        ("6","Mini Mock 6","23 Aug","CD","-","35","-","-","-",MOCKS[0]),
        ("7","Full Mock 1","26 Aug","All","-","100","-","-","-",MOCKS[1]),
        ("8","Full Mock 2","28 Aug","All","-","100","-","-","-",MOCKS[2]),
        ("9","Full Mock 3","30 Aug","All","-","100","-","-","-",MOCKS[3]),
        ("10","Final Mock","31 Aug","All","-","100","-","-","-",MOCKS[4]),
    ]
    for i,row in enumerate(mks):
        bg=RA if i%2==0 else WC; c.setFillColor(bg); c.rect(M,y-14,sum(mc),14,fill=1,stroke=0)
        cx=M
        for j,val in enumerate(row):
            if j==9:
                c.setFillColor(AC); c.setFont("Helvetica",5); c.drawString(cx+2,y-10,"Click: "+val[:55])
                lnk(c,cx,y-14,mc[j],14,val)
            else:
                c.setFillColor(DG); c.setFont("Helvetica",6); c.drawString(cx+2,y-10,val)
            cx+=mc[j]
        y-=14
    y-=12
    rr(c,M,y-75,w-2*M,75,8,fl=WC,sk=LG)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",11); c.drawString(M+15,y-15,"Mock Resources (CLICKABLE)")
    res=[("GFG GATE Mocks",MOCKS[0]),("Testbook Mock",MOCKS[1]),("GFG Practice",MOCKS[2]),("Oliveboard",MOCKS[3]),("Unacademy",MOCKS[4])]
    ry=y-32
    for nm,url in res:
        c.setFillColor(AC); c.setFont("Helvetica",9); c.drawString(M+20,ry,">> "+nm)
        lnk(c,M+20,ry-3,180,12,url)
        c.setFillColor(MG); c.setFont("Helvetica",6); c.drawString(M+200,ry,url[:90]); ry-=13
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"GATE CSE 2027 — Mock Tracker | Page {pn}")
    c.showPage(); return pn+1

def weak(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+5,h-23,"Weak Topics & Error Notebook")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-55
    wk=[28,80,90,60,40,60,60,50,35,290]
    wh=["#","Subject","Topic","Error","Freq","First","Last","OK?","Rev#","Notes"]
    c.setFillColor(NAVY); c.rect(M,y-15,sum(wk),15,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",6); cx=M
    for hdr in wh: c.drawString(cx+2,y-11,hdr); cx+=wk[wh.index(hdr)]
    y-=15
    for i in range(35):
        bg=RA if i%2==0 else WC; c.setFillColor(bg); c.rect(M,y-14,sum(wk),14,fill=1,stroke=0)
        c.setStrokeColor(HexColor("#EDF2F7")); c.setLineWidth(0.15); c.line(M,y-14,M+sum(wk),y-14)
        c.setFillColor(LG); c.setFont("Helvetica",5.5); c.drawString(M+3,y-10,str(i+1)); y-=14
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"GATE CSE 2027 — Weak Topics | Page {pn}")
    c.showPage(); return pn+1

def ready(c,pn):
    w,h=PW,PH
    c.setFillColor(SW); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,h-35,w,35,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica-Bold",12); c.drawString(M+5,h-23,"Ready for Phase 2")
    c.setFont("Helvetica",8); c.drawRightString(w-M-5,h-22,f"Page {pn}")
    y=h-60
    sd=[("Engineering Mathematics",NAVY,50),("Digital Logic",AC,27),("Compiler Design",GR,41)]
    cw_=(w-2*M-2*20)/3
    for i,(sn,sc,ts) in enumerate(sd):
        x=M+i*(cw_+20)
        rr(c,x,y-130,cw_,130,10,fl=WC,sk=LG)
        rr(c,x,y-28,cw_,28,10,fl=sc); c.setFillColor(sc); c.rect(x,y-28,cw_,12,fill=1,stroke=0)
        c.setFillColor(WC); c.setFont("Helvetica-Bold",11); c.drawCentredString(x+cw_/2,y-20,sn)
        gx,gy=x+cw_/2,y-72
        c.setStrokeColor(LG); c.setLineWidth(8); c.circle(gx,gy,28,fill=0,stroke=1)
        c.setFillColor(MG); c.setFont("Helvetica-Bold",16); c.drawCentredString(gx,gy+5,"0%")
        c.setFont("Helvetica",7); c.drawCentredString(gx,gy-8,f"0/{ts}")
        checks=["Theory [ ]","Practice [ ]","PYQs [ ]","Revision [ ]"]
        cy=y-115
        for j in range(0,len(checks),2):
            c.setFillColor(DG); c.setFont("Helvetica",7.5); c.drawString(x+10,cy,checks[j])
            if j+1<len(checks): c.drawString(x+cw_/2+5,cy,checks[j+1])
            cy-=12
    y-=150; rr(c,M,y-180,w-2*M,180,10,fl=WC,sk=LG)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",14); c.drawString(M+20,y-22,"Final Readiness Checklist")
    for i,ch_ in enumerate(["All 3 subjects theory done (6h/day since 20 Jul)","All practice targets met",
        "GATE PYQs 2015-2026 solved >70%","All 3 revisions done","All 10 mocks taken","Formula+cheat sheets updated",
        "Error notebook reviewed","Weak topics improved","Confidence >= 7/10","No pending doubts","Ready Phase 2"]):
        c.setFillColor(DG); c.setFont("Helvetica",10); c.drawString(M+30,y-42-i*14,f"[ ] {ch_}")
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"GATE CSE 2027 — Ready Phase 2 | Page {pn}")
    c.showPage(); return pn+1

def sig(c,pn):
    w,h=PW,PH
    c.setFillColor(NAVY_D); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setStrokeColor(HexColor("#1E3A5F")); c.setLineWidth(0.3)
    for i in range(0,int(w),40): c.line(i,0,i,h)
    y=h*.7
    c.setFillColor(WC); c.setFont("Helvetica-Bold",28); c.drawCentredString(w/2,y,"Phase 1 Complete")
    y-=30; c.setFillColor(AL); c.setFont("Helvetica",16)
    c.drawCentredString(w/2,y,"20 Jul — 31 Aug 2026 | 43 Days | 6 Hours/Day")
    y-=60; c.setFillColor(LG); c.setFont("Helvetica",12)
    c.drawCentredString(w/2,y,"Every video watched, every PYQ solved, every formula mastered.")
    y-=50
    for lbl in ["Student Signature","Date","Mentor / Guide","Final Review"]:
        c.setFillColor(MG); c.setFont("Helvetica",10); c.drawCentredString(w/2,y,lbl)
        y-=20; c.setFillColor(WC); c.setFont("Helvetica",14); c.drawCentredString(w/2,y,"________________________")
        y-=35
    c.setStrokeColor(AC); c.setLineWidth(2); c.line(w*.3,y,w*.7,y)
    y-=30; c.setFillColor(MG); c.setFont("Helvetica",9)
    c.drawCentredString(w/2,y,"GATE CSE 2027 — Phase 1 Master Preparation Workbook")
    c.setFillColor(NAVY); c.rect(0,0,w,25,fill=1,stroke=0)
    c.setFillColor(WC); c.setFont("Helvetica",7); c.drawCentredString(w/2,9,f"Page {pn}")
    c.showPage(); return pn+1

def main():
    out=r"C:\Users\sekha\.agents\skills\brandkit\GATE_CSE_2027_Phase1_Workbook_v3.pdf"
    os.makedirs(os.path.dirname(out),exist_ok=True)
    c_=canvas.Canvas(out,pagesize=landscape(A3))
    c_.setTitle("GATE CSE 2027 Phase 1 Workbook")
    print(f"Cols:{NC} Subtopics:{sum(len(t) for _,_,t in SUBJECTS)}")
    print("1.Cover"); cover(c_)
    print("2.Dashboard"); dashboard(c_)
    print("3.Tables"); pn=tables(c_,3)
    print("4.Weekly"); pn=weekly(c_,pn)
    print("5.VideoDir"); pn=vid_dir(c_,pn)
    print("6.Formula"); pn=formula(c_,pn)
    print("7.Completion"); pn=completion(c_,pn)
    print("8.Mocks"); pn=mocks(c_,pn)
    print("9.Weak"); pn=weak(c_,pn)
    print("10.Ready"); pn=ready(c_,pn)
    print("11.Sig"); pn=sig(c_,pn)
    c_.save(); sz=os.path.getsize(out)
    print(f"\nDONE: {out}\nPages:{pn-1} Size:{sz/(1024*1024):.2f}MB")

if __name__=="__main__":
    main()
