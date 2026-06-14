/* ============================================================
   FutureGo — AI Career OS
   Renaissance Edition Interactive Engine
   ============================================================ */

class FutureGoApp {
    constructor() {
        this.sections = document.querySelectorAll('.chapter-section');
        this.navItems = document.querySelectorAll('.chapter-list li');
        this.topNavLinks = document.querySelectorAll('.nav-link');
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.scrollRAF = null;

        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupScrollObserver();
        this.setupParallax();
        this.setupMagneticCards();
        this.setupHeroParticles();
        this.setupScrollReveal();
        this.setupOpportunityFilter();
        this.setupGooseCompanion();
        this.setupNavScrollEffect();
        this.setupOverviewDashboard();
        this.setupMetricModal();
        this.setupTwinRoleCards();
        this.setupInsightCards();
        this.setupJourney();
        this.setupMission();
    }

    // ===== 平滑滚动与导航 =====
    setupSmoothScroll() {
        // 左侧章节导航点击
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;
                this.scrollToSection(chapter);
            });
        });

        // 顶部导航链接点击
        this.topNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const section = link.dataset.section;
                this.scrollToSection(section);
            });
        });

        // 全局 scrollToSection
        window.scrollToSection = (id) => this.scrollToSection(id);
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;

        const offset = target.offsetTop;

        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });

        this.updateActiveNav(sectionId);
    }

    // ===== Intersection Observer 章节监听 =====
    setupScrollObserver() {
        const options = {
            root: null,
            rootMargin: '-35% 0px -35% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.updateActiveNav(id);
                    this.triggerSectionAnimation(entry.target);
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }

    updateActiveNav(sectionId) {
        if (this.currentSection === sectionId) return;
        this.currentSection = sectionId;

        // 更新左侧导航
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.chapter === sectionId);
        });

        // 更新顶部导航
        this.topNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // 更新顶部导航栏样式（深色章节切换）
        const darkSections = ['twin', 'mission', 'opportunity'];
        const nav = document.getElementById('topNav');
        if (darkSections.includes(sectionId)) {
            nav.classList.add('on-dark');
        } else {
            nav.classList.remove('on-dark');
        }
    }

    triggerSectionAnimation(section) {
        // 触发 scroll-reveal 动画
        const animatable = section.querySelectorAll('[data-animate]');
        animatable.forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });

        // Career Twin 动画
        if (section.id === 'twin') {
            this.animateMetricBars();
            this.animateTwinExtras();
        }

        // Mission 进度条动画
        if (section.id === 'mission') {
            this.animateMissionBars();
        }

        // Growth Insight 进度条动画
        if (section.id === 'insight') {
            this.animateInsightBars();
        }

        // 概览仪表盘动画
        if (section.id === 'hero') {
            this.animateOverviewDashboard();
        }
    }

    // ===== Scroll Reveal =====
    setupScrollReveal() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('[data-animate]').forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ===== 视差滚动 =====
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.3;
                        el.style.transform = `translateY(${scrollY * speed}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== 磁性卡片效果 =====
    setupMagneticCards() {
        const cards = document.querySelectorAll('.metric-card, .opp-card, .mission-card, .insight-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateX = (y / rect.height) * -6;
                const rotateY = (x / rect.width) * 6;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
                card.style.transition = 'none';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // ===== Hero 粒子效果 =====
    setupHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 40;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.opacitySpeed = (Math.random() - 0.5) * 0.005;
                this.life = Math.random() * 200 + 100;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.opacitySpeed;
                this.life--;

                if (this.opacity <= 0 || this.opacity >= 0.5) {
                    this.opacitySpeed *= -1;
                }

                if (this.life <= 0 || this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
                ctx.fill();
            }
        }

        // 初始化粒子
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ===== 腾讯校招机会筛选 =====
    setupOpportunityFilter() {
        const tabs = document.querySelectorAll('.opp-tab');
        const cards = document.querySelectorAll('.opp-card');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                cards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                        // 重新触发动画
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        // 腾讯校招机会卡片点击 — 展示详情弹窗
        this.oppDetailData = {
            'tencent-da': {
                title: '数据分析暑期实习生 — PCG',
                company: '腾讯 · PCG 平台与内容事业群',
                location: '深圳',
                match: 92,
                desc: '参与海量用户行为数据分析，负责增长策略的数据支持。你将接触亿级用户数据，使用SQL和Python进行数据挖掘、AB实验分析和产品策略优化。你的CS背景+策略产品经验是这个岗位的理想人选。',
                requirements: ['熟悉SQL和Python', '有数据分析项目经验', '了解AB测试基本原理', '硕士及以上优先'],
                timeline: '投递截止：2026年7月15日 · 面试：7月下旬 · 入职：8月初'
            },
            'tencent-dp': {
                title: '数据产品策划实习生 — CDG',
                company: '腾讯 · CDG 企业发展事业群',
                location: '深圳',
                match: 85,
                desc: '参与腾讯广告数据产品的策划与迭代，设计数据可视化看板，推动数据驱动决策。你的策略产品实习经验和AI产品背景与这个方向高度契合。',
                requirements: ['对数据产品有热情', '了解数据可视化', '具备产品思维', '有产品实习经验优先'],
                timeline: '投递截止：2026年7月20日 · 面试：8月初'
            },
            'tencent-ds': {
                title: '技术研究-数据科学方向 — TEG',
                company: '腾讯 · TEG 技术工程事业群',
                location: '深圳/北京',
                match: 88,
                desc: '负责大规模数据挖掘与机器学习建模，参与腾讯核心业务的数据驱动决策。你的NLP科研背景（国家自然科学基金项目）与这个方向高度相关。',
                requirements: ['机器学习基础扎实', 'Python/Golang熟练', '有相关论文或项目', '硕士/博士优先'],
                timeline: '校招投递：2026年8月-9月 · 笔试：9月中旬 · 面试：9-10月'
            },
            'tencent-pm': {
                title: '产品策划/运营 — WXG',
                company: '腾讯 · WXG 微信事业群',
                location: '广州',
                match: 80,
                desc: '参与微信生态产品策划与运营，通过数据分析驱动产品优化。你将深入理解用户需求，设计产品方案，并推动落地执行。微信团队氛围极佳，成长空间大。',
                requirements: ['产品sense好', '数据分析能力强', '有产品实习/项目经验', '对微信生态有深入理解'],
                timeline: '校招投递：2026年8月 · 群面+单面：9-10月'
            },
            'tencent-pre': {
                title: 'Pre留学生-技术专场',
                company: '腾讯 · 全球招募',
                location: '远程/深圳/北京/广州/上海',
                match: 90,
                desc: '面向海外留学生的提前批招聘通道，覆盖数据科学、产品、技术研究等多个方向。Pre留学生项目提供更灵活的面试时间安排和专属的offer流程。',
                requirements: ['海外高校在读', 'GPA 3.5+', '有技术/产品相关背景', '2027届毕业生（研二/大三可投）'],
                timeline: '滚动投递 · 面试安排灵活 · 可远程面试'
            },
            'tencent-club': {
                title: '腾讯高校创新俱乐部',
                company: '腾讯 · 校园合作',
                location: '全国高校',
                match: 95,
                desc: '腾讯官方校园社团，面向全国高校招募。加入后将参与技术分享、产品实战项目、企业参访等活动，优秀成员可获得校招绿色通道和内推资格。',
                requirements: ['在校大学生', '对互联网有热情', '有社团/活动组织经验优先', '专业不限'],
                timeline: '全年滚动招募 · 每学期初集中招新'
            }
        };

        document.querySelectorAll('.opp-apply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const oppId = btn.dataset.opp;
                const data = this.oppDetailData[oppId];
                if (!data) return;

                const modal = document.getElementById('metricModal');
                const content = document.getElementById('modalContent');
                const closeBtn = document.getElementById('modalClose');
                const backdrop = modal.querySelector('.modal-backdrop');

                content.innerHTML = `
                    <div class="modal-header-section">
                        <span class="modal-badge" style="background:rgba(201,169,110,0.12);color:#d4a853;">🐧 腾讯校招</span>
                        <h2 style="font-family:var(--font-serif);font-size:24px;margin:12px 0 8px;">${data.title}</h2>
                        <p style="font-size:13px;opacity:0.6;">${data.company} · ${data.location}</p>
                        <div style="display:flex;align-items:center;gap:12px;margin-top:12px;">
                            <span style="font-size:28px;font-weight:700;color:var(--accent-gold);">${data.match}%</span>
                            <span style="font-size:13px;opacity:0.6;">未来鹅匹配度</span>
                        </div>
                    </div>
                    <div style="margin-top:20px;">
                        <h4 style="font-size:14px;margin-bottom:8px;">岗位描述</h4>
                        <p style="font-size:13px;line-height:1.7;opacity:0.8;">${data.desc}</p>
                    </div>
                    <div style="margin-top:16px;">
                        <h4 style="font-size:14px;margin-bottom:8px;">要求</h4>
                        <ul style="font-size:13px;line-height:1.8;opacity:0.8;padding-left:18px;">
                            ${data.requirements.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top:16px;padding:14px;background:rgba(201,169,110,0.06);border-radius:10px;font-size:12px;line-height:1.6;opacity:0.8;">
                        ⏱ ${data.timeline}
                    </div>
                    <div style="margin-top:20px;display:flex;gap:10px;">
                        <button style="background:linear-gradient(135deg,#d4a853,#c49640);border:none;color:#fff;padding:10px 24px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:500;">投递简历</button>
                        <button class="modal-close-btn-secondary" style="background:transparent;border:1px solid rgba(0,0,0,0.1);padding:10px 24px;border-radius:8px;font-size:13px;cursor:pointer;">关闭</button>
                    </div>
                `;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                const closeModal = () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                };

                closeBtn.onclick = closeModal;
                backdrop.onclick = closeModal;
                content.querySelector('.modal-close-btn-secondary').onclick = closeModal;
            });
        });
    }

    // ===== 未来鹅 全局浮动陪伴搭子 =====
    setupGooseCompanion() {
        const companion = document.getElementById('gooseCompanion');
        const gooseBody = document.getElementById('gooseBody');
        const goosePanel = document.getElementById('goosePanel');
        const goosePanelClose = document.getElementById('goosePanelClose');
        const gooseBubble = document.getElementById('gooseBubble');
        const gooseBubbleText = document.getElementById('gooseBubbleText');
        const gooseStatus = document.getElementById('gooseStatus');
        const gooseChatMessages = document.getElementById('gooseChatMessages');
        const gooseInput = document.getElementById('gooseInput');
        const gooseSend = document.getElementById('gooseSend');
        const gooseSuggestions = document.getElementById('gooseSuggestions');

        // 拖动相关
        let isDragging = false;
        let startX, startY, startLeft, startBottom;
        let hasMoved = false;
        const EDGE_MARGIN = 24;

        // ===== 一对一陪伴引擎：用户画像记忆 =====
        this.gooseMemory = {
            name: '陈同学',
            totalCheckins: 0,
            lastCheckinDate: null,
            lastCheckinNote: '',
            completedMissions: 0,
            totalMissions: 0,
            activeMissions: 0,
            totalJourneyNodes: 0,
            visitedSections: [],
            chatCount: 0,
            firstChatDone: false,
            lastCelebrate: null,
            currentDream: '数据产品经理-PCG',
            streak: 0,           // 连续打卡天数
            lastActiveDate: null
        };

        // ===== 智能回复引擎 =====
        const gooseResponses = {
            '🎯 看看腾讯校招机会': () => {
                const highMatch = Object.values(this.oppDetailData || {}).filter(o => o.match >= 85);
                const names = highMatch.map(o => '• ' + o.title.split('—')[0].trim() + ' (' + o.match + '%匹配)').join('\n');
                return `好的呀！🐧 我帮你扫描了腾讯最新校招动态，发现 ${highMatch.length} 个和你高度匹配的岗位：\n\n${names}\n\n💡 以你${this.gooseMemory.currentDream}的目标，建议优先投递匹配度最高的岗位~\n\n要不要我帮你详细分析某个岗位？`;
            },
            '📊 帮我分析简历匹配度': () => {
                const dream = this.dreamPositions ? this.dreamPositions.find(d => d.id === this.currentDreamId) : null;
                const dreamName = dream ? dream.name : '目标岗位';
                return `让我看看你的简历和${dreamName}的匹配情况~ 📋\n\n✅ **优势匹配**：\n• SQL能力 → 数据岗核心技能，你已经有${this.gooseMemory.totalCheckins > 2 ? '持续练习' : '基础'}了\n• Python数据分析 → 多个BG都需要\n• 自学能力强 → 腾讯非常看重这一点\n\n⚠️ **需要加强**：\n• 机器学习项目经验 → 建议补充1个实战项目\n• AB测试经验 → 腾讯面试高频考点\n\n💡 未来鹅建议：先投PCG数据分析暑期实习，同时准备一个ML项目放到简历里！`;
            },
            '💡 制定腾讯面试准备计划': () => {
                const completed = this.gooseMemory.completedMissions;
                const total = this.gooseMemory.totalMissions;
                const progressText = completed > 0 ? `你已经完成了 ${completed}/${total} 个成长任务，进度不错！` : '你还没有开始执行成长任务哦~';
                return `好嘞！为你定制了腾讯校招备战计划 🎯\n\n${progressText}\n\n**第1-2周：简历 + 基础知识**\n• 按腾讯STAR法则优化简历\n• 刷完SQL高频面试题30道\n\n**第3-4周：项目 + 笔试**\n• 完成1个数据分析项目并上传GitHub\n• 练习腾讯笔试真题（行测+专业）\n\n**第5-6周：面试模拟**\n• 技术面模拟3次（重点：SQL+统计+业务分析）\n• 行为面模拟2次（腾讯重视文化匹配）\n\n要不要我每天提醒你打卡进度？🐧`;
            },
            '🐧 讲讲腾讯各BG的区别': () => '好问题！鹅厂有六大BG，让我给你讲讲 🏢\n\n**TEG 技术工程**：技术中台，数据科学/AI方向的核心，适合想做技术的你\n\n**PCG 平台与内容**：QQ+腾讯视频，用户增长数据分析需求大，实习生培养体系好\n\n**WXG 微信**：广州大本营，产品氛围浓厚，竞争激烈但成长快\n\n**CDG 企业发展**：广告+金融科技，数据产品方向多\n\n**CSIG 云与智慧产业**：ToB业务，行业解决方案方向\n\n**IEG 互动娱乐**：游戏业务，数据分析+用户研究方向多\n\n💡 以你的画像，未来鹅推荐 TEG > PCG > WXG 这个顺序！'
        };

        // 情境感知回复（模糊匹配）
        const getSmartResponse = (text) => {
            const lower = text.toLowerCase();
            if (lower.includes('加油') || lower.includes('鼓励') || lower.includes('累了')) {
                const checkins = this.gooseMemory.totalCheckins;
                const missions = this.gooseMemory.completedMissions;
                return `别灰心呀！🐧 你已经很棒了：打卡了 ${checkins} 次，完成了 ${missions} 个任务。每一步都在靠近鹅厂！累了就休息一下，我一直在这里陪着你~ ✨`;
            }
            if (lower.includes('谢谢') || lower.includes('感谢') || lower.includes('爱你')) {
                return `嘿嘿，不客气！🐧 能陪${this.gooseMemory.name}一起成长是我最开心的事~ 有什么需要随时找我！`;
            }
            if (lower.includes('进度') || lower.includes('怎么样') || lower.includes('状态')) {
                const active = this.gooseMemory.activeMissions;
                const completed = this.gooseMemory.completedMissions;
                const total = this.gooseMemory.totalMissions;
                const nodes = this.gooseMemory.totalJourneyNodes;
                return `${this.gooseMemory.name}，这是你的最新状态 📊\n\n🐧 成长任务：${completed}/${total} 已完成，${active} 个进行中\n📝 成长记录：共 ${nodes} 条\n🎯 目标岗位：${this.gooseMemory.currentDream}\n\n继续加油，鹅厂在等你！`;
            }
            if (lower.includes('今天') || lower.includes('做什么') || lower.includes('建议')) {
                const activeMissions = this.missionData ? this.missionData.filter(m => m.phase === 'active') : [];
                if (activeMissions.length > 0) {
                    const tips = activeMissions.map(m => `• 「${m.title}」— 当前进度 ${m.progress}%，去打卡吧！`).join('\n');
                    return `今天建议你做这些 🎯\n\n${tips}\n\n每完成一项，就离鹅厂更近一步！`;
                }
                return '今天没有进行中的任务哦~ 要不要去「Growth Mission」创建新任务？我可以帮你制定计划！';
            }
            if (lower.includes('你好') || lower.includes('嗨') || lower.includes('hi') || lower.includes('hello')) {
                const greetCount = this.gooseMemory.chatCount;
                const familiarity = greetCount > 5 ? '老熟鹅' : '新朋友';
                return `嗨，${this.gooseMemory.name}！🐧 ${greetCount > 3 ? '又见面啦~' : '初次见面，多多关照！'} 我是你的专属未来鹅，已经是第 ${greetCount} 次聊天了，我们是${familiarity}啦！有什么想聊的？`;
            }
            if (lower.includes('打卡') || lower.includes('checkin')) {
                const count = this.gooseMemory.totalCheckins;
                const streak = this.gooseMemory.streak;
                if (count === 0) return '你还没有打过卡呢！🐧 去「Growth Mission」试试吧，第一次打卡有惊喜哦~';
                return `你已经打卡 ${count} 次啦！${streak > 0 ? '连续' + streak + '天打卡，太厉害了！' : ''} 今天打卡了吗？`;
            }
            if (lower.includes('目标') || lower.includes('岗位') || lower.includes('方向')) {
                return `你当前的目标是「${this.gooseMemory.currentDream}」🎯\n\n在「Career Twin」模块可以查看你的职业画像和匹配度分析，在 Hero 区域可以随时更换心仪岗位~`;
            }
            return null; // 未匹配，用默认回复
        };

        const defaultResponse = () => {
            const tips = [
                '去「腾讯校招机会」看看最新岗位 🔥',
                '到「Career Twin」检查你的岗位匹配度 📊',
                '在「Growth Mission」制定备战计划 ✅',
                '看看「Growth Insight」了解你的优劣势 💡'
            ];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            return `${this.gooseMemory.name}，这个问题我需要再想想~ 🐧 不过你可以：\n\n${randomTip}\n\n或者直接问我关于腾讯校招的任何问题，我都在呢~ ✨`;
        };

        // ===== 情感状态系统 =====
        const emotionStatuses = [
            { text: '在呢~', emoji: '🐧', mood: 'neutral' },
            { text: '盯着你呢👀', emoji: '🐧', mood: 'watchful' },
            { text: '今天打卡了吗？', emoji: '📋', mood: 'reminder' },
            { text: '加油呀！', emoji: '💪', mood: 'cheer' },
            { text: '鹅厂等你🐧', emoji: '🏢', mood: 'hopeful' },
            { text: '别摸鱼啦~', emoji: '🎣', mood: 'teasing' },
            { text: '有新的校招机会！', emoji: '🔥', mood: 'alert' }
        ];
        let statusIdx = 0;
        const statusInterval = setInterval(() => {
            // 根据情境智能选择状态
            const activeCount = this.gooseMemory.activeMissions;
            const hasUnfinished = activeCount > 0;
            const highMatchOpps = this.oppDetailData ? Object.values(this.oppDetailData).filter(o => o.match >= 85).length : 0;

            // 智能轮换：有未完成任务优先提醒
            if (hasUnfinished && statusIdx % 3 === 0) {
                statusIdx = 2; // 「今天打卡了吗？」
            } else {
                statusIdx = (statusIdx + 1) % emotionStatuses.length;
            }
            if (gooseStatus) gooseStatus.textContent = emotionStatuses[statusIdx].text;
        }, 5000);

        // ===== 情境感知气泡系统 =====
        const getContextBubbles = () => {
            const baseBubbles = [
                '你的SQL今天打卡了吗？🐧',
                '腾讯暑期实习开始投递啦！',
                '今天也是通往鹅厂的一天~',
                '需要我帮你看看简历吗？',
                'PCG数据分析岗和你很配哦！'
            ];

            // 根据用户状态动态添加个性化气泡
            const dynamic = [];
            const activeMissions = this.gooseMemory.activeMissions;
            const totalCheckins = this.gooseMemory.totalCheckins;

            if (activeMissions > 0) {
                dynamic.push(`还有${activeMissions}个任务等你完成哦~`);
                dynamic.push('趁现在去打卡吧！每完成一个就离鹅厂近一步');
            }
            if (totalCheckins === 0) {
                dynamic.push('还没打过卡呢，去试试你的第一次打卡吧！🌟');
                dynamic.push('第一次打卡有惊喜哦，我保证~ ✨');
            }
            if (totalCheckins >= 5 && activeMissions === 0) {
                dynamic.push('今天也要继续优秀呀！🏆');
                dynamic.push('你已经是个打卡小达人了！');
            }
            if (this.gooseMemory.completedMissions > 0) {
                dynamic.push(`你已经完成了${this.gooseMemory.completedMissions}个任务，了不起！`);
            }

            return [...baseBubbles, ...dynamic];
        };

        const adjustBubblePosition = () => {
            const rect = companion.getBoundingClientRect();
            const vw = window.innerWidth;
            const gooseCenterX = rect.left + rect.width / 2;
            const bubbleWidth = gooseBubble.offsetWidth || 260;
            const isLeft = companion.classList.contains('docked-left') || (companion.style.left && companion.style.left !== 'auto');

            // 清除之前的溢出类
            gooseBubble.classList.remove('too-close-left', 'too-close-right');

            if (isLeft) {
                // 鹅在左侧，气泡默认在右边；检查右边是否会溢出
                if (rect.right + 14 + bubbleWidth > vw - 12) {
                    gooseBubble.classList.add('too-close-left');
                }
            } else {
                // 鹅在右侧，气泡默认在左边；检查左边是否会溢出
                if (rect.left - 14 - bubbleWidth < 12) {
                    gooseBubble.classList.add('too-close-right');
                }
            }
        };

        const showBubble = () => {
            // 面板打开时不显示气泡
            if (goosePanel.classList.contains('active')) return;

            const bubbles = getContextBubbles();
            const msg = bubbles[Math.floor(Math.random() * bubbles.length)];
            gooseBubbleText.textContent = msg;
            gooseBubble.style.display = 'block';

            // 延迟调整位置（等DOM渲染完成获取宽度）
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    adjustBubblePosition();
                });
            });

            setTimeout(() => { gooseBubble.style.display = 'none'; }, 5000);
        };

        // 窗口resize时重新调整气泡
        window.addEventListener('resize', () => {
            if (gooseBubble.style.display === 'block') {
                adjustBubblePosition();
            }
        });

        // 每30秒随机冒泡
        let bubbleTimer = setInterval(() => {
            showBubble();
        }, 30000);

        // 初始3秒后显示第一个气泡
        setTimeout(() => showBubble(), 3000);

        // === 拖动逻辑 ===
        const onStart = (e) => {
            if (e.target.closest('.goose-panel')) return;
            isDragging = true;
            hasMoved = false;
            companion.classList.add('dragging');
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = companion.getBoundingClientRect();
            startLeft = rect.left;
            startBottom = window.innerHeight - rect.bottom;
            gooseBubble.style.display = 'none';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            const dx = touch.clientX - startX;
            const dy = startY - touch.clientY; // bottom-based

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

            let newLeft = startLeft + dx;
            let newBottom = startBottom + dy;

            // 边界限制
            const ww = window.innerWidth;
            const wh = window.innerHeight;
            const cw = companion.offsetWidth || 68;
            const ch = companion.offsetHeight || 68;

            newLeft = Math.max(0, Math.min(ww - cw, newLeft));
            newBottom = Math.max(0, Math.min(wh - ch - 56, newBottom));

            companion.style.left = newLeft + 'px';
            companion.style.right = 'auto';
            companion.style.bottom = newBottom + 'px';
            companion.classList.remove('docked-left', 'docked-right');
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            companion.classList.remove('dragging');

            // 自动贴边
            const rect = companion.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const ww = window.innerWidth;

            if (centerX < ww / 2) {
                companion.style.left = EDGE_MARGIN + 'px';
                companion.style.right = 'auto';
                companion.classList.add('docked-left');
                companion.classList.remove('docked-right');
            } else {
                companion.style.right = EDGE_MARGIN + 'px';
                companion.style.left = 'auto';
                companion.classList.add('docked-right');
                companion.classList.remove('docked-left');
            }

            // 拖动结束后重新调整气泡位置
            if (gooseBubble.style.display === 'block') {
                adjustBubblePosition();
            }

            // 如果没移动，当作点击
            if (!hasMoved) {
                togglePanel();
            }
        };

        gooseBody.addEventListener('mousedown', onStart);
        gooseBody.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        // === 面板切换 ===
        const togglePanel = () => {
            const isActive = goosePanel.classList.contains('active');
            if (isActive) {
                goosePanel.classList.remove('active');
                gooseBubble.style.display = 'none';
            } else {
                goosePanel.classList.add('active');
                gooseBubble.style.display = 'none';
            }
        };

        goosePanelClose.addEventListener('click', () => {
            goosePanel.classList.remove('active');
        });

        // === 聊天功能 ===
        const sendGooseMessage = (text) => {
            if (!text.trim()) return;

            // 更新聊天计数
            this.gooseMemory.chatCount++;
            if (!this.gooseMemory.firstChatDone) {
                this.gooseMemory.firstChatDone = true;
            }

            // 用户消息
            const userMsg = document.createElement('div');
            userMsg.className = 'goose-msg user';
            userMsg.innerHTML = `
                <div class="goose-msg-content" style="background: rgba(201,169,110,0.12); margin-left: auto; max-width: 75%;">
                    <p>${text}</p>
                </div>
            `;
            gooseChatMessages.appendChild(userMsg);
            gooseChatMessages.scrollTop = gooseChatMessages.scrollHeight;

            // 未来鹅回复（智能路由）
            setTimeout(() => {
                let response;
                // 1. 精确匹配预设
                if (gooseResponses[text]) {
                    response = typeof gooseResponses[text] === 'function' ? gooseResponses[text]() : gooseResponses[text];
                } else {
                    // 2. 情境感知匹配
                    response = getSmartResponse(text);
                }
                // 3. 兜底回复
                if (!response) {
                    response = defaultResponse();
                }

                const aiMsg = document.createElement('div');
                aiMsg.className = 'goose-msg ai';
                aiMsg.innerHTML = `
                    <div class="goose-msg-avatar">
                        <div class="goose-face tiny">
                            <span class="goose-eye left"></span>
                            <span class="goose-eye right"></span>
                            <span class="goose-beak"></span>
                        </div>
                    </div>
                    <div class="goose-msg-content">
                        <p style="white-space: pre-line;">${response}</p>
                    </div>
                `;
                gooseChatMessages.appendChild(aiMsg);
                gooseChatMessages.scrollTop = gooseChatMessages.scrollHeight;
            }, 500 + Math.random() * 700);

            gooseInput.value = '';
        };

        gooseSend.addEventListener('click', () => sendGooseMessage(gooseInput.value));
        gooseInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendGooseMessage(gooseInput.value);
        });

        gooseSuggestions.querySelectorAll('.goose-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                sendGooseMessage(chip.textContent);
            });
        });

        // 点击面板外关闭
        document.addEventListener('click', (e) => {
            if (goosePanel.classList.contains('active') &&
                !companion.contains(e.target)) {
                goosePanel.classList.remove('active');
            }
        });

        // 初始位置：右侧贴边
        companion.classList.add('docked-right');

        // 初始化记忆
        this._updateGooseMemory();
    }

    // ===== 未来鹅记忆更新 =====
    _updateGooseMemory() {
        if (!this.gooseMemory) return;

        // 同步 Mission 数据到记忆
        if (this.missionData) {
            this.gooseMemory.totalMissions = this.missionData.length;
            this.gooseMemory.activeMissions = this.missionData.filter(m => m.phase === 'active').length;
            this.gooseMemory.completedMissions = this.missionData.filter(m => m.phase === 'completed' || m.phase === 'archive').length;

            // 统计总打卡次数
            let totalCheckins = 0;
            this.missionData.forEach(m => {
                totalCheckins += m.checkins.length;
                // 找最新打卡
                m.checkins.forEach(c => {
                    if (!this.gooseMemory.lastCheckinDate || c.date > this.gooseMemory.lastCheckinDate) {
                        this.gooseMemory.lastCheckinDate = c.date;
                        this.gooseMemory.lastCheckinNote = c.note;
                    }
                });
            });
            this.gooseMemory.totalCheckins = totalCheckins;

            // 计算连续打卡天数（简化版）
            const today = this._today();
            if (this.gooseMemory.lastCheckinDate === today || 
                (this.gooseMemory.lastCheckinDate && this._daysBetween(this.gooseMemory.lastCheckinDate, today) <= 1)) {
                if (this.gooseMemory.lastActiveDate !== today) {
                    this.gooseMemory.streak++;
                }
            } else if (this.gooseMemory.lastCheckinDate && this._daysBetween(this.gooseMemory.lastCheckinDate, today) > 1) {
                this.gooseMemory.streak = 0;
            }
            this.gooseMemory.lastActiveDate = today;
        }

        // 同步 Journey 数据
        if (this.journeyData) {
            this.gooseMemory.totalJourneyNodes = this.journeyData.length;
        }

        // 同步 Dream Position
        if (this.dreamPositions && this.currentDreamId) {
            const dream = this.dreamPositions.find(d => d.id === this.currentDreamId);
            if (dream) {
                this.gooseMemory.currentDream = dream.name + '-' + (dream.deptShort || '');
            }
        }
    }

    // ===== 未来鹅情感庆祝反馈 =====
    _gooseCelebrate(event, mission) {
        this._updateGooseMemory();

        const bubble = document.getElementById('gooseBubble');
        const bubbleText = document.getElementById('gooseBubbleText');
        const panel = document.getElementById('goosePanel');
        if (!bubble || !bubbleText) return;

        // 面板打开时不弹出
        if (panel && panel.classList.contains('active')) return;

        let msg = '';
        const name = this.gooseMemory.name;

        switch (event) {
            case 'checkin':
                const firstTime = this.gooseMemory.totalCheckins === 1;
                const streak = this.gooseMemory.streak;
                if (firstTime) {
                    msg = `🎉 ${name}，你的第一次打卡！太棒了！离鹅厂又近了一步！`;
                } else if (streak >= 3) {
                    msg = `🔥 连续${streak}天打卡！${name}你太自律了，鹅厂需要你这样的人！`;
                } else {
                    msg = `✅ 打卡成功！${name}今天又进步了一点~ 当前进度 ${mission.progress}%`;
                }
                break;
            case 'complete':
                msg = `🏆 太厉害了${name}！「${mission.title}」完成了！这是你完成的第 ${this.gooseMemory.completedMissions} 个任务！`;
                break;
            case 'start':
                msg = `🚀 ${name}开始了新任务「${mission.title}」！好的开始是成功的一半，加油！`;
                break;
            case 'evaluate':
                const score = mission.evaluation ? mission.evaluation.score : 0;
                const stars = score >= 90 ? '⭐⭐⭐⭐⭐' : score >= 80 ? '⭐⭐⭐⭐' : score >= 60 ? '⭐⭐⭐' : '⭐⭐';
                msg = `📊 评估完成！「${mission.title}」获得 ${score} 分 ${stars}，${name}继续加油！`;
                break;
        }

        if (!msg) return;

        bubbleText.textContent = msg;
        bubble.style.display = 'block';

        // 调整位置
        const companion = document.getElementById('gooseCompanion');
        if (companion) {
            const adjustBubble = () => {
                const rect = companion.getBoundingClientRect();
                const vw = window.innerWidth;
                const bubbleWidth = bubble.offsetWidth || 260;
                const isLeft = companion.classList.contains('docked-left') || (companion.style.left && companion.style.left !== 'auto');

                bubble.classList.remove('too-close-left', 'too-close-right');
                if (isLeft) {
                    if (rect.right + 14 + bubbleWidth > vw - 12) bubble.classList.add('too-close-left');
                } else {
                    if (rect.left - 14 - bubbleWidth < 12) bubble.classList.add('too-close-right');
                }
            };
            requestAnimationFrame(() => requestAnimationFrame(adjustBubble));
        }

        // 8秒后自动隐藏
        setTimeout(() => { bubble.style.display = 'none'; }, 8000);

        this.gooseMemory.lastCelebrate = { event, time: Date.now() };
    }

    // 辅助：计算两个日期之间的天数差
    _daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    }

    // ===== 顶部导航滚动效果 =====
    setupNavScrollEffect() {
        const nav = document.getElementById('topNav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ===== 进度条动画 =====
    animateMetricBars() {
        const fills = document.querySelectorAll('.metric-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    animateTwinExtras() {
        if (this.twinExtrasAnimated) return;
        this.twinExtrasAnimated = true;

        // 温度计动画
        const thermoFill = document.querySelector('.thermo-fill');
        if (thermoFill) {
            const targetH = thermoFill.style.height;
            thermoFill.style.height = '0%';
            setTimeout(() => {
                thermoFill.style.height = targetH;
            }, 200);
        }

        // 分隔符契合度环动画
        const twinRing = document.getElementById('twinAlignRing');
        if (twinRing) {
            const circumference = 2 * Math.PI * 42; // ~263.9
            const targetPercent = 81;
            const targetOffset = circumference - (targetPercent / 100) * circumference;
            twinRing.style.strokeDashoffset = circumference;
            setTimeout(() => {
                twinRing.style.strokeDashoffset = targetOffset;
            }, 300);
        }

        // 对齐分析环动画
        const alignRing = document.getElementById('alignmentRing');
        if (alignRing) {
            const circ = 2 * Math.PI * 34; // ~213.6
            const targetP = 81;
            const targetOff = circ - (targetP / 100) * circ;
            alignRing.style.strokeDashoffset = circ;
            setTimeout(() => {
                alignRing.style.strokeDashoffset = targetOff;
            }, 500);

            // 数字递增动画
            const alignValueEl = document.getElementById('alignmentValue');
            if (alignValueEl) {
                this.animateNumber(alignValueEl, 0, 81, 1500, '%');
            }
        }

        // 角色卡片进度条动画
        const roleFills = document.querySelectorAll('.role-match-fill');
        roleFills.forEach(fill => {
            const targetW = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                fill.style.width = targetW;
            }, 150);
        });

        // 对比条动画
        const compareFills = document.querySelectorAll('.compare-fill');
        compareFills.forEach((fill, i) => {
            const targetW = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                fill.style.width = targetW;
            }, 400 + i * 150);
        });
    }

    animateNumber(el, from, to, duration, suffix) {
        const start = performance.now();
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (to - from) * eased);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    animateMissionBars() {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // ===== Insight Progress Bars 动画 =====
    animateInsightBars() {
        // Animate the top-level progress bars (strength/weakness/risk)
        const insightBars = document.querySelectorAll('.insight-progress-bar');
        insightBars.forEach((bar, i) => {
            const targetWidth = bar.style.width || getComputedStyle(bar).width;
            bar.style.width = '0%';
            bar.style.transition = 'none';
            setTimeout(() => {
                bar.style.transition = `width 1.2s cubic-bezier(0.16, 1, 0.3, 1)`;
                bar.style.width = targetWidth;
            }, 120 + i * 150);
        });

        // Animate the potential card bar-fills
        const barFills = document.querySelectorAll('.insight-bar-fill');
        barFills.forEach((fill, i) => {
            const targetWidth = fill.style.width || getComputedStyle(fill).width;
            fill.style.width = '0%';
            fill.style.transition = 'none';
            setTimeout(() => {
                fill.style.transition = `width 1.2s cubic-bezier(0.16, 1, 0.3, 1)`;
                fill.style.width = targetWidth;
            }, 300 + i * 120);
        });
    }

    // ===== 概览仪表盘 =====
    setupOverviewDashboard() {
        this.overviewAnimated = false;

        // 根据时间设置问候语
        this.updateGreeting();

        // 快捷导航芯片点击
        document.querySelectorAll('.quick-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const target = chip.dataset.target;
                if (target) this.scrollToSection(target);
            });
        });

        // 心仪岗位模块
        this.setupDreamPosition();

        // ===== 数据联动：Hero 仪表盘动态更新 =====
        this.refreshHeroDashboard();
    }

    // ===== Hero 仪表盘数据联动 =====
    refreshHeroDashboard() {
        // 1. 进行中任务数 ← 来自 missionData
        const activeMissionCount = this.missionData ? 
            this.missionData.filter(m => m.phase === 'active').length : 3;
        const elMission = document.getElementById('heroActiveMissions');
        if (elMission) elMission.textContent = activeMissionCount;

        // 2. 本周完成数 ← 来自 missionData
        const today = this._today();
        const thisWeekCompleted = this.missionData ? 
            this.missionData.filter(m => {
                if (m.phase !== 'completed') return false;
                // 简单判断：最近7天内完成
                if (!m.completedAt) return false;
                const daysDiff = this._daysUntil(m.completedAt);
                // completedAt 是过去日期，_daysUntil 会返回负数，取绝对值
                return Math.abs(daysDiff) <= 7;
            }).length : 2;
        const totalThisWeek = this.missionData ? 
            this.missionData.filter(m => m.phase === 'active' || (m.phase === 'completed' && m.completedAt && Math.abs(this._daysUntil(m.completedAt)) <= 7)).length : 5;
        const elSub = document.getElementById('heroMissionSub');
        if (elSub) elSub.textContent = `本周已完成 ${thisWeekCompleted}/${totalThisWeek}`;

        // 3. 高匹配机会数 ← 来自 oppDetailData 中 match >= 85 的
        if (this.oppDetailData) {
            const highMatchCount = Object.values(this.oppDetailData).filter(o => o.match >= 85).length;
            const elUrgent = document.getElementById('heroUrgentCount');
            if (elUrgent) elUrgent.textContent = highMatchCount;
        }

        // 4. 成长清晰度 ← 综合计算（基于 Mission 完成率 + Journey 丰富度）
        this.updateClarityScore();
    }

    // ===== 成长清晰度动态计算 =====
    updateClarityScore() {
        let score = 0;
        
        // Mission 完成率 (0-40分)
        if (this.missionData && this.missionData.length > 0) {
            const completed = this.missionData.filter(m => m.phase === 'completed' || m.phase === 'archive').length;
            const completionRate = completed / this.missionData.length;
            score += Math.round(completionRate * 40);
        }

        // Journey 丰富度 (0-30分) — 项目/实习/比赛越多越好
        if (this.journeyData && this.journeyData.length > 0) {
            const diversity = Math.min(this.journeyData.length / 15, 1);
            score += Math.round(diversity * 30);
        }

        // 心仪岗位匹配度贡献 (0-20分)
        if (this.dreamPositions && this.currentDreamId) {
            const dream = this.dreamPositions.find(d => d.id === this.currentDreamId);
            if (dream) {
                score += Math.round((dream.match / 100) * 20);
            }
        }

        // 评估数据贡献 (0-10分)
        if (this.missionData) {
            const evaluated = this.missionData.filter(m => m.evaluation).length;
            score += Math.min(evaluated * 5, 10);
        }

        // 边界限制
        score = Math.max(10, Math.min(100, score));

        // 更新 DOM
        const elValue = document.getElementById('heroClarityValue');
        if (elValue) elValue.textContent = score;

        // 更新环形图
        const ring = document.getElementById('heroClarityRing');
        if (ring) {
            const circumference = 157;
            const offset = circumference - (score / 100) * circumference;
            ring.setAttribute('stroke-dashoffset', offset);
        }
    }

    // ===== 我最心仪的岗位 =====
    setupDreamPosition() {
        // 预设可选岗位列表
        this.dreamPositions = [
            {
                id: 'pm-pcg',
                name: '数据产品经理',
                dept: 'PCG 平台与内容事业群',
                deptShort: 'PCG',
                icon: '🏢',
                match: 65,
                tags: ['产品策划', '数据分析', '用户增长'],
                desc: '参与亿级用户产品策略，用数据驱动产品决策。你有策略产品实习经验+AI产品背景，与这个方向高度契合。',
                note: '你有策略产品实习经验+信息分析学术背景，产品与数据结合是你的天然优势'
            },
            {
                id: 'da-teg',
                name: '数据分析师',
                dept: 'TEG 技术工程事业群',
                deptShort: 'TEG',
                icon: '📊',
                match: 88,
                tags: ['SQL', 'Python', '数据挖掘', 'AB实验'],
                desc: '负责腾讯核心业务的大规模数据分析与挖掘，是通往数据科学家的最佳起点。',
                note: '你的CS+信息分析双背景与TEG数据科学方向高度吻合，是当前通往鹅厂的最优路径'
            },
            {
                id: 'ds-teg',
                name: '技术研究-数据科学',
                dept: 'TEG 技术工程事业群',
                deptShort: 'TEG',
                icon: '🔬',
                match: 78,
                tags: ['机器学习', 'Python', '算法', '数据挖掘'],
                desc: '参与腾讯前沿AI与大数据研究。你的科研经验（国家自然科学基金项目）与此方向高度相关。',
                note: '你有AI研究经历加持，这是高成长性的方向'
            },
            {
                id: 'pm-wxg',
                name: '产品策划/运营',
                dept: 'WXG 微信事业群',
                deptShort: 'WXG',
                icon: '💬',
                match: 72,
                tags: ['产品策划', '用户研究', '数据分析'],
                desc: '参与微信生态产品策划与运营，影响十亿用户的产品体验。',
                note: '微信生态充满想象空间，你的多段策略产品实习是强力背书'
            },
            {
                id: 'ba-cdg',
                name: '商业分析师',
                dept: 'CDG 企业发展事业群',
                deptShort: 'CDG',
                icon: '💼',
                match: 74,
                tags: ['商业分析', '市场研究', 'SQL', 'PPT'],
                desc: '为腾讯投资与战略决策提供数据分析支持，接触商业核心逻辑。',
                note: '商业分析是连接技术与业务的桥梁，信息分析专业对口'
            }
        ];

        // 当前选中的岗位 (默认第一个)
        this.currentDreamId = this.dreamPositions[0].id;
        this.updateDreamPositionDisplay();

        // 更换按钮
        const switchBtn = document.getElementById('dreamSwitchBtn');
        if (switchBtn) {
            switchBtn.addEventListener('click', () => this.openDreamSelect());
        }

        // 弹窗关闭
        const closeBtn = document.getElementById('dreamSelectClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDreamSelect());
        }

        // 点击遮罩关闭
        const backdrop = document.querySelector('.dream-select-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeDreamSelect());
        }

        // ESC 关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDreamSelect();
        });
    }

    updateDreamPositionDisplay() {
        const pos = this.dreamPositions.find(p => p.id === this.currentDreamId);
        if (!pos) return;

        // 更新卡片内容
        const deptEl = document.getElementById('dreamRoleDept');
        const nameEl = document.getElementById('dreamRoleName');
        const tagsEl = document.getElementById('dreamRoleTags');
        const noteEl = document.getElementById('dreamPositionNote');
        const ring = document.getElementById('dreamMatchRing');
        const valueEl = document.getElementById('dreamMatchValue');

        if (deptEl) deptEl.textContent = pos.dept;
        if (nameEl) nameEl.textContent = pos.name;
        if (tagsEl) {
            tagsEl.innerHTML = pos.tags.map(t => `<span class="dream-tag">${t}</span>`).join('');
        }
        if (noteEl) noteEl.textContent = pos.note;
        if (valueEl) valueEl.textContent = pos.match;

        // 动画环形图
        if (ring) {
            const circumference = 2 * Math.PI * 34; // ~213.6
            const targetOffset = circumference - (pos.match / 100) * circumference;
            ring.setAttribute('stroke-dashoffset', targetOffset);
        }

        // 更新选择列表中的选中状态
        document.querySelectorAll('.dream-option-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.positionId === this.currentDreamId);
        });
    }

    openDreamSelect() {
        const overlay = document.getElementById('dreamSelectOverlay');
        if (!overlay) return;

        // 渲染岗位列表
        this.renderDreamSelectList();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeDreamSelect() {
        const overlay = document.getElementById('dreamSelectOverlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderDreamSelectList() {
        const listEl = document.getElementById('dreamSelectList');
        if (!listEl) return;

        listEl.innerHTML = this.dreamPositions.map(pos => `
            <div class="dream-option-card ${pos.id === this.currentDreamId ? 'selected' : ''}"
                 data-position-id="${pos.id}">
                <div class="dream-option-top">
                    <span class="dream-option-name">${pos.icon} ${pos.name}</span>
                    <span class="dream-option-dept">${pos.deptShort}</span>
                </div>
                <div class="dream-option-match">意愿匹配 ${pos.match}%</div>
                <div class="dream-option-tags">
                    ${pos.tags.map(t => `<span class="dream-tag">${t}</span>`).join('')}
                </div>
                <p class="dream-option-desc">${pos.desc}</p>
                <button class="dream-option-btn" data-action="select" data-position-id="${pos.id}">
                    ${pos.id === this.currentDreamId ? '✓ 当前心仪' : '★ 选择这个'}
                </button>
            </div>
        `).join('');

        // 绑定选择事件
        listEl.querySelectorAll('.dream-option-btn[data-action="select"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const posId = btn.dataset.positionId;
                if (posId !== this.currentDreamId) {
                    this.currentDreamId = posId;
                    this.updateDreamPositionDisplay();
                    this.closeDreamSelect();
                    this.refreshHeroDashboard();
                }
            });
        });

        // 点击整个卡片也可选择
        listEl.querySelectorAll('.dream-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const posId = card.dataset.positionId;
                if (posId !== this.currentDreamId) {
                    this.currentDreamId = posId;
                    this.updateDreamPositionDisplay();
                    this.closeDreamSelect();
                }
            });
        });
    }

    updateGreeting() {
        const timeEl = document.getElementById('greetingTime');
        if (!timeEl) return;
        const hour = new Date().getHours();
        let greeting;
        if (hour < 6) greeting = '夜深了';
        else if (hour < 9) greeting = '早上好';
        else if (hour < 12) greeting = '上午好';
        else if (hour < 14) greeting = '中午好';
        else if (hour < 18) greeting = '下午好';
        else if (hour < 22) greeting = '晚上好';
        else greeting = '夜深了';
        timeEl.textContent = greeting;
    }

    animateOverviewDashboard() {
        if (this.overviewAnimated) return;
        this.overviewAnimated = true;

        // 动画清晰度环形图
        this.animateHeroClarityRing();

        // 动画匹配度进度条
        this.animateHeroMatchBar();

        // 动画心仪岗位匹配度环
        this.animateDreamMatchRing();

        // 数据卡片入场动画 (由 CSS animation-delay 控制)
        const statCards = document.querySelectorAll('.hero-stat-card');
        statCards.forEach(card => card.classList.add('visible'));

        // 时间线条目入场
        const timelineItems = document.querySelectorAll('.timeline-item[data-animate]');
        timelineItems.forEach(item => item.classList.add('visible'));
    }

    animateHeroClarityRing() {
        const ring = document.getElementById('heroClarityRing');
        const valueEl = document.getElementById('heroClarityValue');

        if (!ring || !valueEl) return;

        const circumference = 2 * Math.PI * 25; // ~157
        const targetPercent = 63;
        const targetOffset = circumference - (targetPercent / 100) * circumference;

        let currentOffset = circumference;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            currentOffset = circumference - eased * (circumference - targetOffset);
            ring.setAttribute('stroke-dashoffset', currentOffset);

            const currentValue = Math.round(eased * targetPercent);
            valueEl.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    animateHeroMatchBar() {
        const bar = document.getElementById('heroMatchBar');
        if (!bar) return;

        // 先重置再动画
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = '88%';
        }, 300);
    }

    animateDreamMatchRing() {
        const ring = document.getElementById('dreamMatchRing');
        const valueEl = document.getElementById('dreamMatchValue');

        if (!ring || !valueEl) return;

        const circumference = 2 * Math.PI * 34; // ~213.6
        const targetPercent = parseInt(valueEl.textContent) || 65;
        const targetOffset = circumference - (targetPercent / 100) * circumference;

        let currentOffset = circumference;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            currentOffset = circumference - eased * (circumference - targetOffset);
            ring.setAttribute('stroke-dashoffset', currentOffset);

            const currentValue = Math.round(eased * targetPercent);
            valueEl.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // ===== Metric Detail Modal =====
    setupMetricModal() {
        this.modal = document.getElementById('metricModal');
        this.modalContent = document.getElementById('modalContent');
        this.modalClose = document.getElementById('modalClose');
        this.modalBackdrop = this.modal.querySelector('.modal-backdrop');

        // Metric detail data
        this.metricDetails = {
            // External Space
            '综合技能评分': {
                icon: '📊',
                space: 'External Space · 外部现实空间',
                score: '78',
                unit: '/100',
                scoreLabel: '数据科学方向综合能力评估',
                scorePercent: '78%',
                description: '综合技能评分基于你的课程成绩、项目经验、实习经历和行业对标数据，由AI模型综合计算得出。CS本科+信息分析硕士的复合背景为你奠定了坚实的技术+分析双基础。',
                breakdown: [
                    { label: 'Python/Golang', level: '82%', tag: 'strength' },
                    { label: 'SQL 数据库', level: '88%', tag: 'strength' },
                    { label: '产品策略能力', level: '80%', tag: 'strength' },
                    { label: '机器学习', level: '62%', tag: 'weakness' },
                    { label: '数据分析', level: '78%', tag: 'strength' },
                    { label: 'AI产品经验', level: '75%', tag: 'neutral' }
                ],
                suggestion: 'Python/Golang编程和产品策略能力突出。建议重点提升机器学习工程能力，将62%提升至75%以上，并充分发挥AI产品经验的独特优势。'
            },
            '岗位匹配度': {
                icon: '🎯',
                space: 'External Space · 外部现实空间',
                score: '72',
                unit: '%',
                scoreLabel: '数据分析师岗位匹配度',
                scorePercent: '72%',
                description: '岗位匹配度衡量你的技能组合与目标岗位需求的吻合程度。当前以「数据分析师」为锚定岗位，覆盖技能要求、项目经验、工具熟练度等维度。策略产品实习经验为数据分析+产品方向提供了独特加分项。',
                breakdown: [
                    { label: '硬技能匹配', level: '78%', tag: 'strength' },
                    { label: '项目经验匹配', level: '65%', tag: 'neutral' },
                    { label: '工具链覆盖', level: '80%', tag: 'strength' },
                    { label: '行业知识', level: '68%', tag: 'neutral' },
                    { label: '软技能', level: '72%', tag: 'neutral' }
                ],
                suggestion: '硬技能和工具链匹配良好，策略产品经验可弥补行业知识短板。建议补充1-2个工业级数据分析项目作为作品集。'
            },
            '竞争热度': {
                icon: '🌡️',
                space: 'External Space · 外部现实空间',
                score: '中高',
                unit: '',
                scoreLabel: '一线城市数据分析师岗位竞争热度',
                scorePercent: '65%',
                description: '竞争热度反映目标岗位的供需紧张程度。当前一线城市数据分析师岗位供需比约 1:8，属于中等偏高竞争水平。但AI方向岗位需求量持续增长，你的AI产品经验是差异化优势。',
                breakdown: [
                    { label: '岗位需求量', level: '高', tag: 'strength' },
                    { label: '求职者数量', level: '多', tag: 'weakness' },
                    { label: '薪资中位数', level: '15-25K', tag: 'neutral' },
                    { label: '硕士应届友好度', level: '中高', tag: 'strength' },
                    { label: 'AI方向需求增长', level: '强劲', tag: 'strength' }
                ],
                suggestion: '竞争虽激烈但AI方向需求持续增长。建议利用策略产品+AI经验的复合背景进行差异化定位，这是你最大的竞争优势。'
            },
            // Internal Space
            '兴趣倾向': {
                icon: '💡',
                space: 'Internal Space · 内部意愿空间',
                score: '',
                unit: '',
                scoreLabel: '',
                scorePercent: '',
                description: '兴趣倾向通过分析你的实习经历、科研方向、课程选择和项目偏好，识别你在职业方向上的真实兴趣分布。',
                tags: [
                    { name: 'AI产品策略', level: '核心兴趣', tag: 'strength' },
                    { name: '数据分析', level: '高兴趣', tag: 'strength' },
                    { name: 'NLP/机器学习', level: '高兴趣', tag: 'strength' },
                    { name: '商业策略', level: '中等兴趣', tag: 'neutral' },
                    { name: '纯工程开发', level: '低兴趣', tag: 'weakness' }
                ],
                suggestion: '核心兴趣集中在AI产品与数据驱动决策领域，与你的实习经验和科研方向高度一致。这是非常有竞争力的差异化定位。'
            },
            '意愿强度': {
                icon: '🔥',
                space: 'Internal Space · 内部意愿空间',
                score: '85',
                unit: '/100',
                scoreLabel: '长期投入意愿强度',
                scorePercent: '85%',
                description: '意愿强度衡量你对该职业方向的长期投入意愿和坚持动力。从CS本科到信息分析硕士的学术路径，加上多段策略产品实习的实践积累，展现了你对该方向的持续投入。',
                breakdown: [
                    { label: '学习投入度', level: '90%', tag: 'strength' },
                    { label: '主动探索频率', level: '85%', tag: 'strength' },
                    { label: '放弃成本感知', level: '80%', tag: 'strength' },
                    { label: '职业认同感', level: '88%', tag: 'strength' },
                    { label: '长期规划清晰度', level: '75%', tag: 'neutral' }
                ],
                suggestion: '意愿强度非常高，跨专业考研到信息分析方向证明了你的决心。注意保持学习节奏，避免因强度过高导致倦怠。'
            },
            '排斥方向': {
                icon: '🚫',
                space: 'Internal Space · 内部意愿空间',
                score: '',
                unit: '',
                scoreLabel: '',
                scorePercent: '',
                description: '排斥方向帮助你明确「不想做什么」，与「想做什么」同等重要。通过分析你回避的课程、项目中不喜欢的部分和日常表达的偏好识别。',
                tags: [
                    { name: '纯前端开发', level: '明确排斥', tag: 'weakness' },
                    { name: '运维工程', level: '明确排斥', tag: 'weakness' },
                    { name: '硬件开发', level: '无兴趣', tag: 'weakness' },
                    { name: '纯后端架构', level: '低兴趣', tag: 'neutral' },
                    { name: '测试工程', level: '低兴趣', tag: 'neutral' }
                ],
                suggestion: '排斥方向清晰有助于避免职业选择的弯路。你的偏好偏向「AI产品策略+数据分析」而非「纯工程实现」，这一定位与你的实习经历高度一致。'
            }
        };

        // Click handler for metric cards
        const metricCards = document.querySelectorAll('#twin .metric-card');
        metricCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't interfere with the magnetic card effect
                const metricName = card.querySelector('.metric-name');
                if (metricName) {
                    this.openMetricModal(metricName.textContent.trim());
                }
            });
        });

        // Close handlers
        this.modalClose.addEventListener('click', () => this.closeMetricModal());
        this.modalBackdrop.addEventListener('click', () => this.closeMetricModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMetricModal();
        });
    }

    openMetricModal(metricName) {
        const data = this.metricDetails[metricName];
        if (!data) return;

        let html = `
            <div class="modal-metric-header">
                <div class="modal-metric-icon">${data.icon}</div>
                <div class="modal-metric-info">
                    <h3>${metricName}</h3>
                    <span class="modal-space-tag">${data.space}</span>
                </div>
            </div>
        `;

        // Score section (if score exists)
        if (data.score) {
            html += `
                <div class="modal-score-section">
                    <div class="modal-big-score">${data.score}<span class="score-unit">${data.unit}</span></div>
                    <div class="modal-score-detail">
                        <div class="modal-score-bar">
                            <div class="modal-score-fill" style="width:0%"></div>
                        </div>
                        <span class="modal-score-label">${data.scoreLabel}</span>
                    </div>
                </div>
            `;
        }

        // Description
        html += `
            <div class="modal-detail-section">
                <h4>指标说明</h4>
                <p>${data.description}</p>
            </div>
        `;

        // Breakdown or Tags
        if (data.breakdown) {
            html += `
                <div class="modal-detail-section">
                    <h4>详细构成</h4>
                    <div class="modal-tags">
            `;
            data.breakdown.forEach(item => {
                html += `<span class="modal-tag ${item.tag}">${item.label} · ${item.level}</span>`;
            });
            html += `
                    </div>
                </div>
            `;
        }

        if (data.tags) {
            html += `
                <div class="modal-detail-section">
                    <h4>兴趣分布</h4>
                    <div class="modal-tags">
            `;
            data.tags.forEach(item => {
                html += `<span class="modal-tag ${item.tag}">${item.name} · ${item.level}</span>`;
            });
            html += `
                    </div>
                </div>
            `;
        }

        // Suggestion
        if (data.suggestion) {
            html += `
                <div class="modal-detail-section">
                    <h4>AI 建议</h4>
                    <p>"${data.suggestion}"</p>
                </div>
            `;
        }

        // Actions
        html += `
            <div class="modal-action-row">
                <button class="modal-action-btn secondary" onclick="document.querySelector('#twin .metric-card:nth-child(${this.getMetricIndex(metricName)})">深入了解</button>
                <button class="modal-action-btn primary" onclick="document.getElementById('metricModal').classList.remove('active')">知道了</button>
            </div>
        `;

        this.modalContent.innerHTML = html;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate score bar
        setTimeout(() => {
            const fill = this.modalContent.querySelector('.modal-score-fill');
            if (fill && data.scorePercent) {
                fill.style.width = data.scorePercent;
            }
        }, 200);
    }

    getMetricIndex(metricName) {
        const names = ['综合技能评分', '岗位匹配度', '竞争热度', '兴趣倾向', '意愿强度', '排斥方向'];
        return names.indexOf(metricName) + 1;
    }

    closeMetricModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== Twin 角色卡片交互 =====
    setupTwinRoleCards() {
        // 角色卡片详情数据
        this.roleDetails = {
            '数据产品经理': {
                emoji: '🏢',
                type: 'dream',
                title: '数据产品经理',
                subtitle: '你内心最向往的方向',
                color: 'var(--accent-teal)',
                wishMatch: 88,
                abilityMatch: 65,
                description: '数据产品经理是连接数据能力与产品策略的桥梁角色。你有多段策略产品实习经验+信息分析学术背景，对这个方向有天然的热情和积累。产品sense和数据能力的双重优势将帮助你在这个方向脱颖而出。',
                strengths: ['策略产品实习经验丰富', 'AI产品全流程经验', '数据分析+商业思维兼具'],
                gaps: ['缺少大厂产品实习经历', '用户研究方法论待系统化', '技术深度需持续积累'],
                roadmap: '建议路径：数据分析师/策略产品实习（1-2年）→ 数据产品经理。利用已有策略产品经验作为跳板，在数据岗位积累业务理解后自然过渡。'
            },
            '数据分析师': {
                emoji: '📊',
                type: 'fit',
                title: '数据分析师',
                subtitle: '当前能力最匹配的方向',
                color: 'var(--accent-gold)',
                wishMatch: 72,
                abilityMatch: 88,
                description: '数据分析师是你的能力锚点岗位。CS本科+信息分析硕士的双重背景让你在数据方向具备独特竞争力。Python/Golang编程能力+SQL+科研经验，研二(27届)阶段是投递正式岗和实习的黄金时期。',
                strengths: ['CS+信息分析复合背景', 'Python/Golang编程能力', '有科研项目经验（NLP方向）'],
                gaps: ['机器学习工程化不足', 'AB测试实战经验欠缺', '面试表达待提升'],
                roadmap: '建议路径：研二秋招正式岗。优先投递互联网/科技行业数据分析岗，积累业务sense和团队协作经验。策略产品实习经验可作为差异化优势。'
            }
        };

        // 点击角色卡片弹出详情
        const roleCards = document.querySelectorAll('.role-card');
        roleCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // 不干扰磁性效果
                const titleEl = card.querySelector('.role-title');
                if (titleEl) {
                    const roleName = titleEl.textContent.trim();
                    this.openRoleModal(roleName);
                }
            });
        });

        // 对齐卡片也增加点击
        const alignmentCard = document.querySelector('.alignment-card');
        if (alignmentCard) {
            alignmentCard.style.cursor = 'pointer';
            alignmentCard.addEventListener('click', () => {
                this.openAlignmentDetail();
            });
        }
    }

    openRoleModal(roleName) {
        const data = this.roleDetails[roleName];
        if (!data) return;

        const color = data.color;
        const matchBar = data.type === 'dream'
            ? `<div class="rm-bar-row"><span>意愿匹配</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:${data.wishMatch}%;background:${color}"></div></div><strong style="color:${color}">${data.wishMatch}%</strong></div>
               <div class="rm-bar-row"><span>能力匹配</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:${data.abilityMatch}%;background:var(--accent-gold)"></div></div><strong style="color:var(--accent-gold)">${data.abilityMatch}%</strong></div>`
            : `<div class="rm-bar-row"><span>综合匹配</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:${data.abilityMatch}%;background:${color}"></div></div><strong style="color:${color}">${data.abilityMatch}%</strong></div>
               <div class="rm-bar-row"><span>意愿匹配</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:${data.wishMatch}%;background:var(--accent-teal)"></div></div><strong style="color:var(--accent-teal)">${data.wishMatch}%</strong></div>`;

        const strengthsHtml = data.strengths.map(s => `<li class="rm-li plus">${s}</li>`).join('');
        const gapsHtml = data.gaps.map(g => `<li class="rm-li minus">${g}</li>`).join('');

        const html = `
            <div class="rm-header" style="border-bottom-color:${color}20">
                <div class="rm-emoji">${data.emoji}</div>
                <div>
                    <h3 class="rm-title">${data.title}</h3>
                    <span class="rm-subtitle">${data.subtitle}</span>
                </div>
            </div>
            <div class="rm-section">
                <h4>岗位画像</h4>
                <p>${data.description}</p>
            </div>
            <div class="rm-section">
                <h4>匹配分析</h4>
                <div class="rm-bars">${matchBar}</div>
            </div>
            <div class="rm-two-col">
                <div class="rm-section">
                    <h4 style="color:var(--accent-teal)">✓ 优势</h4>
                    <ul class="rm-list">${strengthsHtml}</ul>
                </div>
                <div class="rm-section">
                    <h4 style="color:var(--accent-rose)">○ 待补足</h4>
                    <ul class="rm-list">${gapsHtml}</ul>
                </div>
            </div>
            <div class="rm-section">
                <h4>发展路径</h4>
                <p class="rm-roadmap">${data.roadmap}</p>
            </div>
            <div class="modal-action-row">
                <button class="modal-action-btn secondary" onclick="document.getElementById('metricModal').classList.remove('active')">关闭</button>
                <button class="modal-action-btn primary">查看详细成长计划</button>
            </div>
        `;

        this.modalContent.innerHTML = html;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 动画进度条
        setTimeout(() => {
            const fills = this.modalContent.querySelectorAll('.rm-bar-fill');
            fills.forEach((fill, i) => {
                const tw = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    fill.style.width = tw;
                }, 100 + i * 150);
            });
        }, 200);
    }

    openAlignmentDetail() {
        const html = `
            <div class="rm-header" style="border-bottom-color:rgba(201,169,110,0.15)">
                <div class="rm-emoji">◈</div>
                <div>
                    <h3 class="rm-title">你的职业契合度</h3>
                    <span class="rm-subtitle">双空间对齐 · 综合评估</span>
                </div>
            </div>
            <div class="rm-section">
                <h4>什么是契合度？</h4>
                <p>契合度衡量你「能做什么」（外部能力）与「想做什么」（内心意愿）之间的一致性。高契合度意味着你当前的能力发展方向与真实的职业兴趣高度共振——这是职业满意度和长期成长的最佳预测指标。</p>
            </div>
            <div class="rm-section">
                <h4>你的契合度分析</h4>
                <div class="rm-bars">
                    <div class="rm-bar-row"><span>外部能力得分</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:78%;background:var(--accent-gold)"></div></div><strong style="color:var(--accent-gold)">78</strong></div>
                    <div class="rm-bar-row"><span>内心意愿得分</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:85%;background:var(--accent-teal)"></div></div><strong style="color:var(--accent-teal)">85</strong></div>
                    <div class="rm-bar-row"><span>综合契合度</span><div class="rm-bar-track"><div class="rm-bar-fill" style="width:81%;background:var(--accent-gold)"></div></div><strong style="color:var(--accent-gold)">81%</strong></div>
                </div>
            </div>
            <div class="rm-section">
                <h4>AI 洞察</h4>
                <p>你的意愿强度（85）略高于能力水平（78），这是非常健康的信号——你有足够的热情驱动自己去弥补能力差距。你的策略产品实习经验是独特的差异化竞争力，将机器学习工程能力从62%提升至75%以上，将直接缩小你与数据产品经理目标岗位之间的能力鸿沟。</p>
            </div>
            <div class="rm-section">
                <h4>关键对比</h4>
                <div class="rm-compare-cards">
                    <div class="rm-mini-card">
                        <span class="rm-mini-label">高匹配维度</span>
                        <span class="rm-mini-value" style="color:var(--accent-teal)">技能 ↔ 岗位 88%</span>
                        <span class="rm-mini-desc">CS+信息分析背景与数据分析师要求高度吻合</span>
                    </div>
                    <div class="rm-mini-card">
                        <span class="rm-mini-label">待突破维度</span>
                        <span class="rm-mini-value" style="color:var(--accent-rose)">竞争 ↔ 机会 55%</span>
                        <span class="rm-mini-desc">一线城市竞争激烈，需要差异化定位（策略产品经验是突破口）</span>
                    </div>
                </div>
            </div>
            <div class="modal-action-row">
                <button class="modal-action-btn secondary" onclick="document.getElementById('metricModal').classList.remove('active')">关闭</button>
                <button class="modal-action-btn primary">获取提升建议</button>
            </div>
        `;

        this.modalContent.innerHTML = html;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const fills = this.modalContent.querySelectorAll('.rm-bar-fill');
            fills.forEach((fill, i) => {
                const tw = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    fill.style.width = tw;
                }, 100 + i * 120);
            });
        }, 200);
    }

    // ===== Insight Card Detail Panel =====
    setupInsightCards() {
        this.insightOverlay = document.getElementById('insightDetailOverlay');
        this.insightPanel = document.getElementById('insightDetailPanel');
        this.insightContent = document.getElementById('insightDetailContent');
        this.insightClose = document.getElementById('insightDetailClose');
        this.insightBackdrop = this.insightOverlay.querySelector('.insight-detail-backdrop');

        // Detail data for each insight type
        this.insightDetails = {
            strength: {
                icon: '✦',
                iconBg: 'rgba(107,158,158,0.10)',
                iconColor: 'var(--accent-teal)',
                title: '优势 Strengths',
                subtitle: '核心资产 · 你的竞争力基础',
                analysis: '你拥有CS工科本科+信息分析硕士的复合背景，这在数据分析师赛道中属于稀缺组合。3段策略产品实习经验让你具备了产品sense和业务理解能力。Python/Golang编程能力+科研项目经验（NLP方向）使你在技术层面具备差异化竞争力。',
                metrics: [
                    { label: 'CS+信息分析复合背景', value: '90%', width: '90%' },
                    { label: '策略产品实习经验', value: '85%', width: '85%' },
                    { label: 'Python/Golang编程', value: '82%', width: '82%' },
                    { label: 'AI产品全流程经验', value: '80%', width: '80%' },
                ],
                actions: [
                    '在简历中突出策略产品实习+AI产品经验的独特组合',
                    '将国家自然科学基金科研项目包装为技术亮点',
                    '用Python/Golang项目证明工程落地能力',
                    '保持对AI产品方向的持续关注和学习',
                ],
            },
            weakness: {
                icon: '◇',
                iconBg: 'rgba(212,133,106,0.10)',
                iconColor: 'var(--accent-rose)',
                title: '短板 Weaknesses',
                subtitle: '待提升 · 关键成长瓶颈',
                analysis: '你的短板集中在工程落地和面试表达两个维度。机器学习从理论到工程的距离较大，缺乏端到端工业级数据分析项目。缺少大厂实习经历在腾讯校招中是一个需要弥补的缺口。面试中如何高效表达你的复合能力也需要刻意练习。',
                metrics: [
                    { label: 'ML 工程落地', value: '35%', width: '35%' },
                    { label: '工业级数据项目', value: '30%', width: '30%' },
                    { label: '面试表达', value: '50%', width: '50%' },
                    { label: '大厂实习经历', value: '20%', width: '20%' },
                ],
                actions: [
                    '完成 1 个端到端 ML 项目（数据清洗→建模→部署→监控）',
                    '利用策略产品经验反向包装数据分析能力',
                    '每周进行 1-2 次模拟面试练习',
                    '争取腾讯等大厂的暑期实习机会',
                ],
            },
            risk: {
                icon: '△',
                iconBg: 'rgba(212,167,106,0.10)',
                iconColor: '#d4a76a',
                title: '风险 Risks',
                subtitle: '⚠ 需关注 · 时间窗口与外部威胁',
                analysis: '研二秋招是求职的黄金窗口期，当前时间紧迫。机器学习赛道虽然热门但竞争激烈，你需要差异化定位——策略产品+AI经验的组合是独特优势。没有大厂实习背景在简历筛选阶段可能处于劣势，需要通过项目经历和科研经验弥补。',
                metrics: [
                    { label: '时间紧迫度', value: '90%', width: '90%' },
                    { label: '赛道竞争度', value: '75%', width: '75%' },
                    { label: '经验差距', value: '60%', width: '60%' },
                    { label: '精力分散风险', value: '55%', width: '55%' },
                ],
                actions: [
                    '立即开始投递数据分析师/策略产品实习岗位（窗口期约 4-6 周）',
                    '将策略产品实习+AI经验作为差异化定位的核心卖点',
                    '优先投递AI/数据方向岗位，充分发挥NLP科研背景',
                    '制定每周时间分配表，确保核心方向获得 70% 以上精力',
                ],
            },
            potential: {
                icon: '◆',
                iconBg: 'rgba(201,169,110,0.10)',
                iconColor: 'var(--accent-gold)',
                title: '潜力方向 Potential',
                subtitle: '增长路径 · 职业发展可能性',
                analysis: '数据分析师是你当前的最优匹配方向——CS+信息分析背景与数据岗位高度吻合。数据产品经理可作为中期差异化方向，你的策略产品实习经验是强力背书。AI产品经理是新兴高价值方向，结合你的AI产品经验和NLP科研背景。技术研究-数据科学可作为长期目标。',
                metrics: [
                    { label: '数据分析师匹配', value: '94%', width: '94%' },
                    { label: '数据产品经理匹配', value: '82%', width: '82%' },
                    { label: 'AI产品经理匹配', value: '78%', width: '78%' },
                    { label: '技术研究-数据科学', value: '65%', width: '65%' },
                ],
                actions: [
                    '短期（0-6月）：锁定数据分析师/策略产品实习岗位',
                    '中期（6-18月）：评估是否深耕AI产品方向',
                    '长期（18月+）：在数据分析基础上结合AI领域深入发展',
                    '持续关注商业分析技能，作为横向竞争力储备',
                ],
            },
        };

        // Click handler for insight cards
        const insightCards = document.querySelectorAll('.insight-card[data-insight]');
        insightCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.dataset.insight;
                this.openInsightDetail(type);
            });
        });

        // Close handlers
        this.insightClose.addEventListener('click', () => this.closeInsightDetail());
        this.insightBackdrop.addEventListener('click', () => this.closeInsightDetail());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.insightOverlay.classList.contains('active')) {
                this.closeInsightDetail();
            }
        });
    }

    openInsightDetail(type) {
        const data = this.insightDetails[type];
        if (!data) return;

        const typeClass = type;

        let metricsHtml = '';
        if (data.metrics) {
            metricsHtml = data.metrics.map(m => `
                <div class="detail-metric-bar">
                    <span class="detail-metric-label">${m.label}</span>
                    <div class="detail-metric-track">
                        <div class="detail-metric-fill ${typeClass}" data-width="${m.width}"></div>
                    </div>
                    <span class="detail-metric-value">${m.value}</span>
                </div>
            `).join('');
        }

        let actionsHtml = '';
        if (data.actions) {
            actionsHtml = data.actions.map((a, i) => `
                <li class="detail-action-item">
                    <span class="detail-action-num ${typeClass}">${i + 1}</span>
                    <span>${a}</span>
                </li>
            `).join('');
        }

        const html = `
            <div class="detail-panel-icon" style="background:${data.iconBg};color:${data.iconColor}">${data.icon}</div>
            <h2 class="detail-panel-title">${data.title}</h2>
            <p class="detail-panel-subtitle">${data.subtitle}</p>

            <div class="detail-section">
                <h4>深层分析</h4>
                <p class="detail-analysis-text">${data.analysis}</p>
            </div>

            ${data.metrics ? `
            <div class="detail-section">
                <h4>能力评估</h4>
                ${metricsHtml}
            </div>
            ` : ''}

            ${data.actions ? `
            <div class="detail-section">
                <h4>行动建议</h4>
                <ul class="detail-action-list">
                    ${actionsHtml}
                </ul>
            </div>
            ` : ''}
        `;

        this.insightContent.innerHTML = html;
        this.insightOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate metric bars — read target width from data-width attribute
        setTimeout(() => {
            const fills = this.insightContent.querySelectorAll('.detail-metric-fill');
            fills.forEach((fill, i) => {
                const targetWidth = fill.dataset.width || '50%';
                fill.style.width = '0%';
                fill.style.transition = 'none';
                setTimeout(() => {
                    fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    fill.style.width = targetWidth;
                }, 80 + i * 100);
            });
        }, 200);
    }

    closeInsightDetail() {
        this.insightOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== Growth Journey 横向树形时间轴 =====
    setupJourney() {
        this.journeyTreeBody = document.getElementById('journeyTreeBody');
        this.journeyTreeSvg = document.getElementById('journeyTreeSvg');
        this.journeyTreeScroll = document.getElementById('journeyTreeScroll');
        this.journeyFilterTabs = document.getElementById('journeyFilterTabs');
        this.journeySearchInput = document.getElementById('journeySearchInput');
        this.journeySearchResults = document.getElementById('journeySearchResults');
        this.journeyEditOverlay = document.getElementById('journeyEditOverlay');
        this.journeyEditContent = document.getElementById('journeyEditContent');
        this.journeyEditClose = document.getElementById('journeyEditClose');
        this.journeyEditBackdrop = this.journeyEditOverlay.querySelector('.journey-edit-backdrop');
        this.addMemoryBtn = document.getElementById('addMemoryBtn');

        this.currentFilter = 'all';
        this.editingNodeId = null;
        this._searchIdx = -1;

        // Journey data with branch support
        // branch: null = main trunk; "branch-name" = side branch
        this.journeyData = [
            // 大一上 - 主干
            { id: 'j1', semester: '大一上', date: '2020.09', title: 'C程序设计基础', desc: '系统学习C语言编程，掌握基础算法与数据结构，为后续编程学习奠定基础。', type: 'course', tags: ['C语言', '编程基础'], branch: null },
            { id: 'j2', semester: '大一上', date: '2020.12', title: '计算机导论课程设计', desc: '完成程序设计基础课程设计项目，获得优秀评价。', type: 'project', tags: ['程序设计', '课程项目'], branch: null },
            // 大一下 - 分支：编程技能 + 数学基础
            { id: 'j3', semester: '大一下', date: '2021.03', title: 'C++程序设计', desc: '学习面向对象编程，掌握C++核心语法与设计模式。', type: 'course', tags: ['C++', '面向对象'], branch: '编程技能' },
            { id: 'j4', semester: '大一下', date: '2021.05', title: '离散数学与线性代数', desc: '系统学习离散数学和线性代数，为算法与AI方向打下数学基础。', type: 'course', tags: ['离散数学', '线性代数'], branch: '数学基础' },
            { id: 'j4b', semester: '大一下', date: '2021.04', title: '电路与电子学基础', desc: '学习硬件基础课程，了解计算机底层原理。', type: 'course', tags: ['电路', '硬件基础'], branch: '数学基础' },
            // 大二上 - 分支
            { id: 'j5', semester: '大二上', date: '2021.09', title: '数据结构A', desc: '深入学习数据结构与算法，完成课程设计项目。', type: 'course', tags: ['数据结构', '算法'], branch: null },
            { id: 'j6', semester: '大二上', date: '2021.11', title: '计算机组成原理', desc: '学习计算机体系结构与组成原理，完成课程设计。', type: 'course', tags: ['组成原理', '体系结构'], branch: null },
            { id: 'j7', semester: '大二上', date: '2021.12', title: '概率论与数理统计', desc: '系统学习概率统计基础，掌握假设检验与回归分析。', type: 'course', tags: ['概率论', '统计学'], branch: '理论储备' },
            // 大二下
            { id: 'j8', semester: '大二下', date: '2022.03', title: 'Python应用开发', desc: '学习Python编程，开始接触数据分析与自动化脚本。', type: 'course', tags: ['Python', '编程'], branch: null },
            { id: 'j9', semester: '大二下', date: '2022.05', title: 'Java程序设计', desc: '系统学习Java语言与面向对象设计，完成课程设计项目。', type: 'course', tags: ['Java', '面向对象'], branch: null },
            { id: 'js1', semester: '大二下', date: '2022.06', title: '校级优秀学生奖学金', desc: '凭借优异的学业成绩获得校级二等奖学金，绩点排名专业前10%。', type: 'scholarship', tags: ['校级奖学金', '学业成绩'], branch: '荣誉奖励' },
            // 大三上
            { id: 'j10', semester: '大三上', date: '2022.09', title: '计算机网络A', desc: '学习计算机网络原理与协议，完成课程设计。', type: 'course', tags: ['计算机网络', '协议'], branch: null },
            { id: 'j11', semester: '大三上', date: '2022.11', title: '数据库系统', desc: '学习数据库原理与SQL，完成数据库课程设计项目。', type: 'course', tags: ['数据库', 'SQL'], branch: null },
            { id: 'j12', semester: '大三上', date: '2022.12', title: '大数据技术基础', desc: '学习Hadoop/Spark等大数据技术栈，了解分布式计算。', type: 'course', tags: ['大数据', '分布式'], branch: '数据技能' },
            { id: 'j13', semester: '大三上', date: '2022.10', title: 'Java Web技术', desc: '学习Java Web开发，掌握前后端交互基础。', type: 'course', tags: ['JavaWeb', '全栈'], branch: '工程实践' },
            { id: 'j13b', semester: '大三上', date: '2022.11', title: '移动开发技术', desc: '学习移动端开发技术，了解跨平台开发框架。', type: 'course', tags: ['移动开发', '跨平台'], branch: '工程实践' },
            { id: 'js2', semester: '大三上', date: '2022.12', title: '国家励志奖学金', desc: '综合学业成绩与科研竞赛表现，获得国家励志奖学金。', type: 'scholarship', tags: ['国家级奖学金', '综合表现'], branch: '荣誉奖励' },
            // 大三下
            { id: 'j14', semester: '大三下', date: '2023.03', title: '软件工程A', desc: '学习软件工程方法论，完成团队开发项目。', type: 'course', tags: ['软件工程', '团队协作'], branch: null },
            { id: 'j15', semester: '大三下', date: '2023.05', title: '编译原理', desc: '学习编译原理与语言处理，完成课程设计。', type: 'course', tags: ['编译原理', '语言处理'], branch: null },
            { id: 'j16', semester: '大三下', date: '2023.04', title: '人工智能导论', desc: '学习AI基础理论与算法，激发对NLP方向的兴趣。', type: 'course', tags: ['AI', '机器学习'], branch: null },
            { id: 'j17', semester: '大三下', date: '2023.06', title: '策略产品实习 · 某互联网公司', desc: '参与IM消息产品竞品调研与原型设计，推进项目开发。拓展消息类型与发送渠道，解决现存消息类问题。', type: 'internship', tags: ['产品实习', 'IM', '原型设计'], branch: '实习经历' },
            // 大四上
            { id: 'j18', semester: '大四上', date: '2023.10', title: '增长策略实习 · 某阅读平台', desc: '负责日活百万级激励产品增长策略。完成竞品分析与功能设计，搭建内容消费闭环。设计风控体系，上线首周识别准确率90%。', type: 'internship', tags: ['增长策略', '风控', '数据分析'], branch: '实习经历' },
            { id: 'j19', semester: '大四上', date: '2023.12', title: '计算机专业实践', desc: '完成计算机专业综合实践项目，整合本科所学技能。', type: 'project', tags: ['综合实践', '毕业项目'], branch: null },
            // 大四下
            { id: 'j20', semester: '大四下', date: '2024.02', title: '策略产品实习 · 某数字阅读平台', desc: '优化榜单排序策略，搭建多维指标体系。设计推荐逻辑提升用户粘性与内容分发效率。核心关键词有效阅读率提升至32%。', type: 'internship', tags: ['策略产品', '推荐系统', '数据指标'], branch: '实习经历' },
            // 研一上
            { id: 'j21', semester: '研一上', date: '2024.09', title: '信息检索原理', desc: '学习信息检索核心技术，掌握搜索引擎与推荐系统原理。', type: 'course', tags: ['信息检索', '搜索'], branch: null },
            { id: 'j22', semester: '研一上', date: '2024.11', title: '用户信息行为研究', desc: '研究用户信息行为模型，理解用户需求分析与产品设计方法。', type: 'course', tags: ['用户研究', '产品设计'], branch: null },
            { id: 'j23', semester: '研一上', date: '2024.10', title: '数据挖掘课程', desc: '学习数据挖掘算法与实践，掌握聚类、分类、关联规则等核心技术。', type: 'course', tags: ['数据挖掘', '算法'], branch: '数据技能' },
            { id: 'j24', semester: '研一上', date: '2024.12', title: '国家自然科学基金项目', desc: '参与基于提示学习的双视角惠企政策推荐方法研究。运用NLP技术抽取政策语义，构建内容+偏好双视角推荐框架。', type: 'project', tags: ['NLP', '推荐系统', '科研'], branch: '科研经历' },
            // 研一下
            { id: 'j25', semester: '研一下', date: '2025.03', title: 'AI策略产品实习 · 某教育科技公司', desc: '深度参与AI出题与AI组卷产品全流程。负责提示词设计、调试与迭代，提升题目生成准确性。搭建内容质量评估体系，输出竞品分析报告。', type: 'internship', tags: ['AI产品', '提示词工程', '策略产品'], branch: '实习经历' },
        ];

        this.initJourneyRender();
        this.bindJourneyEvents();
    }

    initJourneyRender() {
        this.renderJourneyTree();
        this.updateJourneyStats();
        this.initTreeDragScroll();
        // 窗口尺寸变化时重绘树枝
        window.addEventListener('resize', () => {
            setTimeout(() => this._drawTreeBranches(), 150);
        });
        // 滚动时也重绘树枝（因为SVG坐标依赖scrollLeft）
        this.journeyTreeScroll.addEventListener('scroll', () => {
            this._drawTreeBranches();
        });
    }

    // ===== 横向树状时间轴渲染 =====
    renderJourneyTree() {
        // 反向学期顺序：从左(最新/现在)到右(最早)
        // 用户当前为研二(27届, 2025.09)，所以从研二下→...→大一上
        const semesterOrder = ['研二下', '研二上', '研一下', '研一上', '大四下', '大四上', '大三下', '大三上', '大二下', '大二上', '大一下', '大一上'];
        const gradeMap = { '大一上': 1, '大一下': 1, '大二上': 2, '大二下': 2, '大三上': 3, '大三下': 3, '大四上': 4, '大四下': 4, '研一上': 5, '研一下': 5, '研二上': 6, '研二下': 6 };

        // 构建按学期+分支分组的数据结构（始终使用全部数据）
        const semesterGroups = [];
        semesterOrder.forEach(sem => {
            const nodes = this.journeyData.filter(n => n.semester === sem);
            if (nodes.length > 0) {
                // 按分支分组: null=主干, 其他=分支
                const branches = {};
                nodes.forEach(node => {
                    const bkey = node.branch || '__trunk__';
                    if (!branches[bkey]) branches[bkey] = [];
                    branches[bkey].push(node);
                });
                // 主干排在前面
                const orderedBranches = [];
                if (branches['__trunk__']) orderedBranches.push({ name: null, nodes: branches['__trunk__'] });
                Object.keys(branches).forEach(key => {
                    if (key !== '__trunk__') orderedBranches.push({ name: key, nodes: branches[key] });
                });
                semesterGroups.push({
                    semester: sem,
                    grade: gradeMap[sem] || 1,
                    branches: orderedBranches
                });
            }
        });

        // 构建HTML
        let bodyHtml = '';
        semesterGroups.forEach(sg => {
            bodyHtml += `<div class="jt-semester-col" data-semester="${sg.semester}" data-grade="${sg.grade}">`;
            bodyHtml += `<div class="jt-semester-label">${sg.semester}</div>`;
            bodyHtml += `<div class="jt-branches">`;
            sg.branches.forEach((br, bi) => {
                const isTrunk = br.name === null;
                bodyHtml += `<div class="jt-branch ${isTrunk ? 'jt-trunk' : ''}" data-branch="${br.name || 'trunk'}">`;
                if (!isTrunk) {
                    bodyHtml += `<div class="jt-branch-label">${this.escapeHtml(br.name)}</div>`;
                }
                bodyHtml += `<div class="jt-nodes">`;
                br.nodes.forEach(node => {
                    bodyHtml += this._renderTreeCard(node);
                });
                bodyHtml += `</div></div>`;
            });
            bodyHtml += `</div></div>`;
        });

        this.journeyTreeBody.innerHTML = bodyHtml;
        this.bindNodeEvents();

        // 应用高亮/变暗样式
        this._applyFilterHighlight();

        // 延迟绘制SVG树枝
        setTimeout(() => this._drawTreeBranches(), 100);
    }

    // 筛选高亮：非选中类型变暗，选中类型突出
    _applyFilterHighlight() {
        const cards = this.journeyTreeBody.querySelectorAll('.jt-card');
        if (this.currentFilter === 'all') {
            cards.forEach(c => c.classList.remove('jt-dimmed', 'jt-highlighted'));
            this.journeyTreeBody.classList.remove('jt-filtering');
            return;
        }
        this.journeyTreeBody.classList.add('jt-filtering');
        cards.forEach(c => {
            if (c.dataset.type === this.currentFilter) {
                c.classList.add('jt-highlighted');
                c.classList.remove('jt-dimmed');
            } else {
                c.classList.add('jt-dimmed');
                c.classList.remove('jt-highlighted');
            }
        });
    }

    // 筛选后自动跳转到最近的目标类型卡片
    _scrollToNearestFilterCard() {
        const scrollContainer = this.journeyTreeScroll;
        if (!scrollContainer || this.currentFilter === 'all') return;

        // 获取视口可见区域
        const containerRect = scrollContainer.getBoundingClientRect();
        const scrollLeft = scrollContainer.scrollLeft;
        const viewLeft = scrollLeft;
        const viewRight = scrollLeft + containerRect.width;

        // 查找所有匹配筛选类型的卡片
        const allMatchCards = Array.from(scrollContainer.querySelectorAll(`.jt-card[data-type="${this.currentFilter}"]`));
        if (allMatchCards.length === 0) return;

        let bestCard = null;
        let bestDist = Infinity;

        for (const card of allMatchCards) {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left - containerRect.left + scrollLeft + cardRect.width / 2;

            // 判断是否在当前可视区域内
            if (cardCenter >= viewLeft && cardCenter <= viewRight) {
                return; // 已经有该类型的卡片在视野中，不需要跳转
            }

            // 找距离视口最近的卡片（优先找左侧最近的，因为时间轴从左=最新开始）
            const distToLeft = Math.abs(cardCenter - viewLeft);
            const distToRight = Math.abs(cardCenter - viewRight);
            const minDist = Math.min(distToLeft, distToRight);

            if (minDist < bestDist) {
                bestDist = minDist;
                bestCard = card;
            }
        }

        // 如果没有在视口内的，滚动到最近的那个
        if (bestCard) {
            const targetRect = bestCard.getBoundingClientRect();
            const targetX = targetRect.left - containerRect.left + scrollLeft;
            const containerWidth = containerRect.width;
            const cardWidth = targetRect.width;
            // 将目标卡片居中显示
            const scrollTo = targetX - containerWidth / 2 + cardWidth / 2;
            scrollContainer.scrollTo({
                left: Math.max(0, scrollTo),
                behavior: 'smooth'
            });
        }
    }

    _renderTreeCard(node) {
        const typeConfig = {
            project:    { label: '项目',   color: 'var(--accent-teal)', bg: 'rgba(107,158,158,0.06)' },
            internship: { label: '实习',   color: 'var(--accent-gold)', bg: 'rgba(201,169,110,0.06)' },
            scholarship:{ label: '奖学金', color: 'var(--accent-rose)', bg: 'rgba(212,133,106,0.06)' },
            course:     { label: '课程',   color: '#9b8ec4',            bg: 'rgba(155,142,196,0.06)' }
        };
        const tc = typeConfig[node.type] || typeConfig.course;
        return `
            <div class="jt-card" data-node-id="${node.id}" data-type="${node.type}" data-semester="${node.semester}"
                 style="--card-color:${tc.color};--card-bg:${tc.bg}">
                <div class="jt-card-header">
                    <span class="jt-card-type" style="background:${tc.color}">${tc.label}</span>
                    <span class="jt-card-date">${node.date}</span>
                </div>
                <h4 class="jt-card-title">${node.title}</h4>
                <p class="jt-card-desc">${node.desc}</p>
                <div class="jt-card-tags">
                    ${node.tags.map(t => `<span class="jt-tag" style="color:${tc.color};background:${tc.bg}">${t}</span>`).join('')}
                </div>
                <div class="jt-card-actions">
                    <button class="jt-action-btn" data-action="edit" data-node-id="${node.id}">编辑</button>
                    <button class="jt-action-btn danger" data-action="delete" data-node-id="${node.id}">删除</button>
                </div>
            </div>
        `;
    }

    // 绘制SVG曲线树枝（支持筛选高亮模式）
    _drawTreeBranches() {
        const svg = this.journeyTreeSvg;
        const scrollContainer = this.journeyTreeScroll;
        if (!svg || !scrollContainer) return;

        const cols = scrollContainer.querySelectorAll('.jt-semester-col');
        if (cols.length < 2) { svg.innerHTML = ''; return; }

        // 设置SVG尺寸
        const scrollWidth = scrollContainer.scrollWidth;
        const scrollHeight = scrollContainer.scrollHeight;
        svg.setAttribute('width', scrollWidth);
        svg.setAttribute('height', scrollHeight);
        svg.style.width = scrollWidth + 'px';
        svg.style.height = scrollHeight + 'px';

        const isFiltering = this.currentFilter !== 'all';
        const filterType = this.currentFilter;

        // 类型颜色映射
        const typeColors = {
            project: 'var(--accent-teal)',
            internship: 'var(--accent-gold)',
            scholarship: 'var(--accent-rose)',
            course: '#9b8ec4'
        };

        let pathsHtml = '';

        // 辅助函数：判断卡片组中是否包含筛选类型的卡片
        const hasFilterType = (cards) => {
            if (!isFiltering) return true;
            return Array.from(cards).some(c => c.dataset.type === filterType);
        };

        // 主干连线：学期之间的横线
        for (let i = 0; i < cols.length - 1; i++) {
            const col = cols[i];
            const nextCol = cols[i + 1];
            const trunkA = col.querySelector('.jt-trunk');
            const trunkB = nextCol.querySelector('.jt-trunk');
            if (!trunkA || !trunkB) continue;

            const nodesA = trunkA.querySelectorAll('.jt-card');
            const nodesB = trunkB.querySelectorAll('.jt-card');
            if (nodesA.length === 0 || nodesB.length === 0) continue;

            const lastCardA = nodesA[nodesA.length - 1];
            const lastCardB = nodesB[nodesB.length - 1];

            const containerRect = scrollContainer.getBoundingClientRect();
            const rectA = lastCardA.getBoundingClientRect();
            const rectB = lastCardB.getBoundingClientRect();

            const x1 = rectA.right - containerRect.left + scrollContainer.scrollLeft;
            const y1 = rectA.top + rectA.height / 2 - containerRect.top + scrollContainer.scrollTop;
            const x2 = rectB.left - containerRect.left + scrollContainer.scrollLeft;
            const y2 = rectB.top + rectB.height / 2 - containerRect.top + scrollContainer.scrollTop;

            const cp1x = x1 + (x2 - x1) * 0.4;
            const cp1y = y1;
            const cp2x = x2 - (x2 - x1) * 0.4;
            const cp2y = y2;

            // 主干连线在筛选模式下变暗
            const trunkOpacity = isFiltering ? '0.1' : '0.35';
            const trunkWidth = isFiltering ? '1.5' : '2';
            pathsHtml += `<path d="M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}"
                fill="none" stroke="var(--accent-gold)" stroke-width="${trunkWidth}" stroke-opacity="${trunkOpacity}"
                stroke-linecap="round" class="jt-svg-trunk jt-svg-base"/>`;
        }

        // 分支连线：同学期内分支与主干的曲线
        cols.forEach(col => {
            const branches = col.querySelectorAll('.jt-branch:not(.jt-trunk)');
            const trunk = col.querySelector('.jt-trunk');
            if (!trunk) return;

            branches.forEach(br => {
                const brCards = br.querySelectorAll('.jt-card');
                const trCards = trunk.querySelectorAll('.jt-card');
                if (brCards.length === 0 || trCards.length === 0) return;

                const firstBrCard = brCards[0];
                const matchTrCard = trCards[0];

                const containerRect = scrollContainer.getBoundingClientRect();
                const rectBr = firstBrCard.getBoundingClientRect();
                const rectTr = matchTrCard.getBoundingClientRect();

                const x1 = rectTr.right - containerRect.left + scrollContainer.scrollLeft;
                const y1 = rectTr.top + rectTr.height / 2 - containerRect.top + scrollContainer.scrollTop;
                const x2 = rectBr.left - containerRect.left + scrollContainer.scrollLeft;
                const y2 = rectBr.top + rectBr.height / 2 - containerRect.top + scrollContainer.scrollTop;

                const cp1x = x1 + (x2 - x1) * 0.5;
                const cp1y = y1;
                const cp2x = x2 - (x2 - x1) * 0.5;
                const cp2y = y2;

                // 判断该分支是否包含筛选类型的卡片
                const branchHasFilterType = hasFilterType(brCards);
                const brOpacity = (!isFiltering || branchHasFilterType) ? '0.3' : '0.08';
                const brStroke = (!isFiltering || branchHasFilterType) ? 'var(--accent-teal)' : '#ccc';
                const brWidth = (!isFiltering || branchHasFilterType) ? '1.5' : '1';

                pathsHtml += `<path d="M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}"
                    fill="none" stroke="${brStroke}" stroke-width="${brWidth}" stroke-opacity="${brOpacity}"
                    stroke-dasharray="4 3" stroke-linecap="round" class="jt-svg-branch jt-svg-base"/>`;
            });
        });

        // 筛选模式下：为匹配类型的卡片对额外绘制高亮连接线
        if (isFiltering) {
            const hlColor = typeColors[filterType] || 'var(--accent-gold)';

            // 高亮主干连线
            for (let i = 0; i < cols.length - 1; i++) {
                const col = cols[i];
                const nextCol = cols[i + 1];
                const trunkA = col.querySelector('.jt-trunk');
                const trunkB = nextCol.querySelector('.jt-trunk');
                if (!trunkA || !trunkB) continue;

                const hlCardsA = trunkA.querySelectorAll(`.jt-card[data-type="${filterType}"]`);
                const hlCardsB = trunkB.querySelectorAll(`.jt-card[data-type="${filterType}"]`);
                if (hlCardsA.length === 0 || hlCardsB.length === 0) continue;

                const lastHlA = hlCardsA[hlCardsA.length - 1];
                const lastHlB = hlCardsB[hlCardsB.length - 1];

                const containerRect = scrollContainer.getBoundingClientRect();
                const rectA = lastHlA.getBoundingClientRect();
                const rectB = lastHlB.getBoundingClientRect();

                const x1 = rectA.right - containerRect.left + scrollContainer.scrollLeft;
                const y1 = rectA.top + rectA.height / 2 - containerRect.top + scrollContainer.scrollTop;
                const x2 = rectB.left - containerRect.left + scrollContainer.scrollLeft;
                const y2 = rectB.top + rectB.height / 2 - containerRect.top + scrollContainer.scrollTop;

                const cp1x = x1 + (x2 - x1) * 0.4;
                const cp1y = y1;
                const cp2x = x2 - (x2 - x1) * 0.4;
                const cp2y = y2;

                pathsHtml += `<path d="M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}"
                    fill="none" stroke="${hlColor}" stroke-width="2.5" stroke-opacity="0.55"
                    stroke-linecap="round" class="jt-svg-trunk jt-svg-hl"/>`;
            }

            // 高亮分支连线
            cols.forEach(col => {
                const branches = col.querySelectorAll('.jt-branch:not(.jt-trunk)');
                const trunk = col.querySelector('.jt-trunk');
                if (!trunk) return;

                branches.forEach(br => {
                    const brHlCards = br.querySelectorAll(`.jt-card[data-type="${filterType}"]`);
                    if (brHlCards.length === 0) return;
                    const trHlCards = trunk.querySelectorAll(`.jt-card[data-type="${filterType}"]`);
                    if (trHlCards.length === 0) return;

                    const firstBrHl = brHlCards[0];
                    const matchTrHl = trHlCards[0];

                    const containerRect = scrollContainer.getBoundingClientRect();
                    const rectBr = firstBrHl.getBoundingClientRect();
                    const rectTr = matchTrHl.getBoundingClientRect();

                    const x1 = rectTr.right - containerRect.left + scrollContainer.scrollLeft;
                    const y1 = rectTr.top + rectTr.height / 2 - containerRect.top + scrollContainer.scrollTop;
                    const x2 = rectBr.left - containerRect.left + scrollContainer.scrollLeft;
                    const y2 = rectBr.top + rectBr.height / 2 - containerRect.top + scrollContainer.scrollTop;

                    const cp1x = x1 + (x2 - x1) * 0.5;
                    const cp1y = y1;
                    const cp2x = x2 - (x2 - x1) * 0.5;
                    const cp2y = y2;

                    pathsHtml += `<path d="M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}"
                        fill="none" stroke="${hlColor}" stroke-width="2.5" stroke-opacity="0.55"
                        stroke-linecap="round" class="jt-svg-branch jt-svg-hl"/>`;
                });
            });
        }

        svg.innerHTML = pathsHtml;
    }

    // 拖拽滚动 + 卡片拖拽移动学期
    initTreeDragScroll() {
        const wrap = document.getElementById('journeyTreeWrap');
        const scroll = this.journeyTreeScroll;
        if (!wrap || !scroll) return;

        let isDown = false;
        let startX = 0;
        let scrollStart = 0;

        // === 区域拖拽滚动（在非卡片区域） ===
        wrap.addEventListener('mousedown', (e) => {
            // 不拦截卡片上的点击（卡片有自己的拖拽逻辑）
            if (e.target.closest('.jt-card') || e.target.closest('.jt-action-btn')) return;
            isDown = true;
            scroll.classList.add('jt-dragging');
            startX = e.pageX;
            scrollStart = scroll.scrollLeft;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const dx = startX - e.pageX;
            scroll.scrollLeft = scrollStart + dx;
        });

        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                scroll.classList.remove('jt-dragging');
            }
        });

        // 触摸支持
        wrap.addEventListener('touchstart', (e) => {
            if (e.target.closest('.jt-card') || e.target.closest('.jt-action-btn')) return;
            isDown = true;
            scroll.classList.add('jt-dragging');
            startX = e.touches[0].pageX;
            scrollStart = scroll.scrollLeft;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const dx = startX - e.touches[0].pageX;
            scroll.scrollLeft = scrollStart + dx;
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                scroll.classList.remove('jt-dragging');
            }
        });

        // === 卡片拖拽：向左向右移动学期 ===
        this._initCardDragMove();
    }

    // 卡片拖拽移动：将卡片拖到不同学期列
    _initCardDragMove() {
        const self = this;
        const body = this.journeyTreeBody;
        if (!body) return;

        let dragCard = null;
        let dragNodeId = null;
        let ghostEl = null;

        body.addEventListener('mousedown', (e) => {
            const card = e.target.closest('.jt-card');
            if (!card) return;
            // 不拦截操作按钮
            if (e.target.closest('.jt-action-btn')) return;
            
            dragCard = card;
            dragNodeId = card.dataset.nodeId;
            card.classList.add('dragging');
            
            // 创建拖拽幽灵元素
            ghostEl = card.cloneNode(true);
            ghostEl.style.position = 'fixed';
            ghostEl.style.pointerEvents = 'none';
            ghostEl.style.zIndex = '9999';
            ghostEl.style.opacity = '0.85';
            ghostEl.style.transform = 'scale(0.95) rotate(-2deg)';
            ghostEl.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)';
            ghostEl.style.width = card.offsetWidth + 'px';
            ghostEl.style.left = e.clientX - card.offsetWidth / 2 + 'px';
            ghostEl.style.top = e.clientY - 20 + 'px';
            document.body.appendChild(ghostEl);
            
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragCard || !ghostEl) return;
            
            ghostEl.style.left = e.clientX - ghostEl.offsetWidth / 2 + 'px';
            ghostEl.style.top = e.clientY - 20 + 'px';
            
            // 高亮目标学期列
            const cols = body.querySelectorAll('.jt-semester-col');
            cols.forEach(col => col.classList.remove('drop-highlight'));
            
            const targetCol = self._findSemesterColUnder(e.clientX, e.clientY);
            if (targetCol && targetCol.dataset.semester !== dragCard.dataset.semester) {
                targetCol.classList.add('drop-highlight');
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (!dragCard) return;
            
            dragCard.classList.remove('dragging');
            
            // 移除幽灵元素
            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }
            
            // 清除所有高亮
            const cols = body.querySelectorAll('.jt-semester-col');
            cols.forEach(col => col.classList.remove('drop-highlight'));
            
            // 检测目标学期
            const targetCol = self._findSemesterColUnder(e.clientX, e.clientY);
            if (targetCol && dragNodeId) {
                const targetSemester = targetCol.dataset.semester;
                const currentSemester = dragCard.dataset.semester;
                if (targetSemester && targetSemester !== currentSemester) {
                    self._moveCardToSemester(dragNodeId, targetSemester);
                }
            }
            
            dragCard = null;
            dragNodeId = null;
        });

        // 触摸支持
        body.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.jt-card');
            if (!card) return;
            if (e.target.closest('.jt-action-btn')) return;
            
            dragCard = card;
            dragNodeId = card.dataset.nodeId;
            card.classList.add('dragging');
            
            ghostEl = card.cloneNode(true);
            ghostEl.style.position = 'fixed';
            ghostEl.style.pointerEvents = 'none';
            ghostEl.style.zIndex = '9999';
            ghostEl.style.opacity = '0.85';
            ghostEl.style.transform = 'scale(0.95) rotate(-2deg)';
            ghostEl.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)';
            ghostEl.style.width = card.offsetWidth + 'px';
            const touch = e.touches[0];
            ghostEl.style.left = touch.clientX - card.offsetWidth / 2 + 'px';
            ghostEl.style.top = touch.clientY - 20 + 'px';
            document.body.appendChild(ghostEl);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!dragCard || !ghostEl) return;
            const touch = e.touches[0];
            ghostEl.style.left = touch.clientX - ghostEl.offsetWidth / 2 + 'px';
            ghostEl.style.top = touch.clientY - 20 + 'px';
            
            const cols = body.querySelectorAll('.jt-semester-col');
            cols.forEach(col => col.classList.remove('drop-highlight'));
            
            const targetCol = self._findSemesterColUnder(touch.clientX, touch.clientY);
            if (targetCol && targetCol.dataset.semester !== dragCard.dataset.semester) {
                targetCol.classList.add('drop-highlight');
            }
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            if (!dragCard) return;
            
            dragCard.classList.remove('dragging');
            
            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }
            
            const cols = body.querySelectorAll('.jt-semester-col');
            cols.forEach(col => col.classList.remove('drop-highlight'));
            
            const touch = e.changedTouches[0];
            const targetCol = self._findSemesterColUnder(touch.clientX, touch.clientY);
            if (targetCol && dragNodeId) {
                const targetSemester = targetCol.dataset.semester;
                const currentSemester = dragCard.dataset.semester;
                if (targetSemester && targetSemester !== currentSemester) {
                    self._moveCardToSemester(dragNodeId, targetSemester);
                }
            }
            
            dragCard = null;
            dragNodeId = null;
        });
    }

    _findSemesterColUnder(clientX, clientY) {
        const cols = this.journeyTreeBody.querySelectorAll('.jt-semester-col');
        for (const col of cols) {
            const rect = col.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                return col;
            }
        }
        return null;
    }

    _moveCardToSemester(nodeId, newSemester) {
        const node = this.journeyData.find(n => n.id === nodeId);
        if (!node) return;
        node.semester = newSemester;
        node.branch = null; // 移动到新学期后默认归到主干
        this.renderJourneyTree();
        this.updateJourneyStats();
        this.refreshHeroDashboard();
        setTimeout(() => this.scrollToJourneyNode(nodeId), 200);
    }

    // 保留旧函数兼容(CRUD中调用)
    renderJourney() {
        this.renderJourneyTree();
    }

    _renderInsertZone(afterId) {
        return '';
    }

    bindNodeEvents() {
        // Action buttons in tree cards
        const actionBtns = this.journeyTreeBody.querySelectorAll('.jt-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const nodeId = btn.dataset.nodeId;
                if (action === 'edit') {
                    this.openJourneyEdit(nodeId);
                } else if (action === 'delete') {
                    this.deleteJourneyNode(nodeId);
                }
            });
        });
    }

    bindJourneyEvents() {
        // Filter tabs
        const filterBtns = this.journeyFilterTabs.querySelectorAll('.jf-tab');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderJourneyTree();

                // 筛选非"全部"时，自动跳转至最近的目标类型卡片位置
                if (this.currentFilter !== 'all') {
                    setTimeout(() => this._scrollToNearestFilterCard(), 200);
                }
            });
        });

        // Smart search
        let searchTimer;
        this.journeySearchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            const query = this.journeySearchInput.value.trim();
            if (!query) {
                this.journeySearchResults.classList.remove('active');
                this.journeySearchResults.innerHTML = '';
                return;
            }
            searchTimer = setTimeout(() => this.performSearch(query), 150);
        });

        this.journeySearchInput.addEventListener('focus', () => {
            const query = this.journeySearchInput.value.trim();
            if (query) this.performSearch(query);
        });

        // Keyboard navigation in search
        this.journeySearchInput.addEventListener('keydown', (e) => {
            const items = this.journeySearchResults.querySelectorAll('.journey-search-result-item');
            if (!items.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this._searchIdx = Math.min(this._searchIdx + 1, items.length - 1);
                this._highlightSearchItem(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this._searchIdx = Math.max(this._searchIdx - 1, 0);
                this._highlightSearchItem(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (this._searchIdx >= 0 && items[this._searchIdx]) {
                    const nodeId = items[this._searchIdx].dataset.nodeId;
                    this._navigateToSearchResult(nodeId);
                }
            } else if (e.key === 'Escape') {
                this.journeySearchResults.classList.remove('active');
                this._searchIdx = -1;
            }
        });

        // Click outside closes search
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.journey-search-box')) {
                this.journeySearchResults.classList.remove('active');
                this._searchIdx = -1;
            }
        });

        // Edit overlay close
        this.journeyEditClose.addEventListener('click', () => this.closeJourneyEdit());
        this.journeyEditBackdrop.addEventListener('click', () => this.closeJourneyEdit());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.journeyEditOverlay.classList.contains('active')) {
                this.closeJourneyEdit();
            }
        });

        // Add memory button
        this.addMemoryBtn.addEventListener('click', () => {
            this.openJourneyInsert(null);
        });
    }

    // ===== Smart Search =====
    performSearch(query) {
        const q = query.toLowerCase();
        const results = [];

        this.journeyData.forEach(node => {
            if (this.currentFilter !== 'all' && node.type !== this.currentFilter) return;

            let score = 0;
            const titleLower = node.title.toLowerCase();
            const descLower = node.desc.toLowerCase();
            const tagsLower = node.tags.map(t => t.toLowerCase()).join(' ');
            const semesterLower = node.semester.toLowerCase();
            const typeMap = { project: '项目', internship: '实习', scholarship: '奖学金', course: '课程' };
            const typeLower = (typeMap[node.type] || node.type).toLowerCase();

            // Exact match on title = highest
            if (titleLower === q) score += 100;
            // Starts with
            if (titleLower.startsWith(q)) score += 50;
            // Contains in title
            if (titleLower.includes(q)) score += 30;
            // Contains in tags
            if (tagsLower.includes(q)) score += 20;
            // Contains in description
            if (descLower.includes(q)) score += 15;
            // Contains in semester
            if (semesterLower.includes(q)) score += 10;
            // Contains in type name
            if (typeLower.includes(q)) score += 8;
            // Fuzzy: word-by-word match
            const queryWords = q.split(/\s+/);
            queryWords.forEach(word => {
                if (word.length < 2) return;
                if (titleLower.includes(word)) score += 8;
                if (tagsLower.includes(word)) score += 6;
                if (descLower.includes(word)) score += 4;
            });

            if (score > 0) {
                results.push({ node, score });
            }
        });

        // Sort by score descending
        results.sort((a, b) => b.score - a.score);

        if (results.length === 0) {
            this.journeySearchResults.innerHTML = `<div class="journey-search-empty">未找到匹配节点</div>`;
        } else {
            const maxResults = Math.min(results.length, 8);
            this.journeySearchResults.innerHTML = results.slice(0, maxResults).map((r, i) => `
                <div class="journey-search-result-item" data-node-id="${r.node.id}" data-index="${i}">
                    <span class="sr-dot ${r.node.type}"></span>
                    <span class="sr-info">
                        <span class="sr-title">${r.node.title}</span>
                        <span class="sr-meta">${r.node.date} · ${r.node.tags.slice(0, 3).join(' / ')}</span>
                    </span>
                    <span class="sr-semester">${r.node.semester}</span>
                </div>
            `).join('');
        }

        this.journeySearchResults.classList.add('active');
        this._searchIdx = -1;

        // Bind click on result items
        const items = this.journeySearchResults.querySelectorAll('.journey-search-result-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const nodeId = item.dataset.nodeId;
                this._navigateToSearchResult(nodeId);
            });
        });
    }

    _highlightSearchItem(items) {
        items.forEach(item => item.classList.remove('active'));
        if (this._searchIdx >= 0 && items[this._searchIdx]) {
            items[this._searchIdx].classList.add('active');
            items[this._searchIdx].scrollIntoView({ block: 'nearest' });
        }
    }

    _navigateToSearchResult(nodeId) {
        this.journeySearchResults.classList.remove('active');
        this.journeySearchInput.value = '';
        this._searchIdx = -1;
        this.scrollToJourneyNode(nodeId);
    }

    scrollToJourneyNode(nodeId) {
        const node = this.journeyTreeBody.querySelector(`[data-node-id="${nodeId}"]`);
        if (!node) return;
        // 水平滚动到该卡片
        const scroll = this.journeyTreeScroll;
        const cardLeft = node.offsetLeft;
        const col = node.closest('.jt-semester-col');
        const targetScroll = col ? col.offsetLeft - 60 : cardLeft - 200;
        scroll.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });

        // Highlight flash
        const card = node;
        card.style.boxShadow = '0 0 0 4px rgba(201,169,110,0.25), 0 8px 32px rgba(0,0,0,0.12)';
        card.style.borderColor = 'var(--accent-gold)';
        setTimeout(() => { card.style.boxShadow = ''; card.style.borderColor = ''; }, 1500);
    }

    scrollToSemester(semester) {
        const col = this.journeyTreeBody.querySelector(`[data-semester="${semester}"]`);
        if (!col) return;
        const scroll = this.journeyTreeScroll;
        scroll.scrollTo({ left: col.offsetLeft - 60, behavior: 'smooth' });
    }

    // ===== Journey CRUD =====
    openJourneyEdit(nodeId) {
        const node = this.journeyData.find(n => n.id === nodeId);
        if (!node) return;
        this.editingNodeId = nodeId;

        const branchOptions = this._getBranchOptions(node.semester);
        const html = `
            <h3>编辑成长记录</h3>
            <div class="journey-form-group">
                <label>标题</label>
                <input type="text" id="jEditTitle" value="${this.escapeHtml(node.title)}" placeholder="记录标题">
            </div>
            <div class="journey-form-group">
                <label>学期</label>
                <select id="jEditSemester">
                    ${['大一上','大一下','大二上','大二下','大三上','大三下','大四上','大四下','研一上','研一下','研二上','研二下'].map(s =>
                        `<option value="${s}" ${s === node.semester ? 'selected' : ''}>${s}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="journey-form-group">
                <label>分支</label>
                <select id="jEditBranch">
                    <option value="__null__" ${node.branch === null ? 'selected' : ''}>主干</option>
                    ${branchOptions.map(b =>
                        `<option value="${b}" ${node.branch === b ? 'selected' : ''}>${b}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="journey-form-group">
                <label>日期</label>
                <input type="text" id="jEditDate" value="${node.date}" placeholder="如 2026.06">
            </div>
            <div class="journey-form-group">
                <label>类型</label>
                <select id="jEditType">
                    <option value="project" ${node.type === 'project' ? 'selected' : ''}>项目</option>
                    <option value="internship" ${node.type === 'internship' ? 'selected' : ''}>实习</option>
                    <option value="scholarship" ${node.type === 'scholarship' ? 'selected' : ''}>奖学金</option>
                    <option value="course" ${node.type === 'course' ? 'selected' : ''}>课程</option>
                </select>
            </div>
            <div class="journey-form-group">
                <label>描述</label>
                <textarea id="jEditDesc" placeholder="记录描述">${this.escapeHtml(node.desc)}</textarea>
            </div>
            <div class="journey-form-group">
                <label>标签（逗号分隔）</label>
                <input type="text" id="jEditTags" value="${node.tags.join(', ')}" placeholder="Python, 数据分析">
            </div>
            <div class="journey-form-actions">
                <button class="journey-form-delete" id="jEditDelete">删除</button>
                <button class="journey-form-cancel" id="jEditCancel">取消</button>
                <button class="journey-form-save" id="jEditSave">保存</button>
            </div>
        `;

        this.journeyEditContent.innerHTML = html;
        this.journeyEditOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('jEditSave').addEventListener('click', () => this.saveJourneyEdit());
        document.getElementById('jEditCancel').addEventListener('click', () => this.closeJourneyEdit());
        document.getElementById('jEditDelete').addEventListener('click', () => {
            this.closeJourneyEdit();
            this.deleteJourneyNode(nodeId);
        });
    }

    _getBranchOptions(semester) {
        const existingBranches = [...new Set(
            this.journeyData
                .filter(n => n.semester === semester && n.branch !== null)
                .map(n => n.branch)
        )];
        return existingBranches;
    }

    openJourneyInsert(afterId) {
        this.editingNodeId = null;

        let defaultSemester = '研二上';
        let defaultDate = '2026.06';
        let defaultBranch = null;
        if (afterId) {
            const afterNode = this.journeyData.find(n => n.id === afterId);
            if (afterNode) {
                defaultSemester = afterNode.semester;
                defaultDate = afterNode.date;
                defaultBranch = afterNode.branch;
            }
        }

        const branchOptions = this._getBranchOptions(defaultSemester);
        const html = `
            <h3>${afterId ? '插入新节点' : '添加成长记录'}</h3>
            <div class="journey-form-group">
                <label>标题</label>
                <input type="text" id="jEditTitle" placeholder="记录标题">
            </div>
            <div class="journey-form-group">
                <label>学期</label>
                <select id="jEditSemester">
                    ${['大一上','大一下','大二上','大二下','大三上','大三下','大四上','大四下','研一上','研一下','研二上','研二下'].map(s =>
                        `<option value="${s}" ${s === defaultSemester ? 'selected' : ''}>${s}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="journey-form-group">
                <label>分支</label>
                <select id="jEditBranch">
                    <option value="__null__" ${defaultBranch === null ? 'selected' : ''}>主干</option>
                    ${branchOptions.map(b =>
                        `<option value="${b}" ${defaultBranch === b ? 'selected' : ''}>${b}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="journey-form-group">
                <label>日期</label>
                <input type="text" id="jEditDate" value="${defaultDate}" placeholder="如 2026.06">
            </div>
            <div class="journey-form-group">
                <label>类型</label>
                <select id="jEditType">
                    <option value="project">项目</option>
                    <option value="internship">实习</option>
                    <option value="scholarship">奖学金</option>
                    <option value="course">课程</option>
                </select>
            </div>
            <div class="journey-form-group">
                <label>描述</label>
                <textarea id="jEditDesc" placeholder="记录描述"></textarea>
            </div>
            <div class="journey-form-group">
                <label>标签（逗号分隔）</label>
                <input type="text" id="jEditTags" placeholder="Python, 数据分析">
            </div>
            <div class="journey-form-actions">
                <button class="journey-form-cancel" id="jEditCancel">取消</button>
                <button class="journey-form-save" id="jEditSave">创建</button>
            </div>
        `;

        this.journeyEditContent.innerHTML = html;
        this.journeyEditOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        this._insertAfterId = afterId;

        document.getElementById('jEditSave').addEventListener('click', () => this.saveJourneyInsert());
        document.getElementById('jEditCancel').addEventListener('click', () => this.closeJourneyEdit());
    }

    _getBranchValue() {
        const val = document.getElementById('jEditBranch').value;
        return val === '__null__' ? null : val;
    }

    saveJourneyEdit() {
        const node = this.journeyData.find(n => n.id === this.editingNodeId);
        if (!node) return;

        node.title = document.getElementById('jEditTitle').value.trim();
        node.semester = document.getElementById('jEditSemester').value;
        node.branch = this._getBranchValue();
        node.date = document.getElementById('jEditDate').value.trim();
        node.type = document.getElementById('jEditType').value;
        node.desc = document.getElementById('jEditDesc').value.trim();
        node.tags = document.getElementById('jEditTags').value.split(',').map(t => t.trim()).filter(Boolean);

        this.closeJourneyEdit();
        this.renderJourney();
        this.updateJourneyStats();
        this.refreshHeroDashboard();
    }

    saveJourneyInsert() {
        const title = document.getElementById('jEditTitle').value.trim();
        if (!title) return;

        const newNode = {
            id: 'j' + Date.now(),
            semester: document.getElementById('jEditSemester').value,
            branch: this._getBranchValue(),
            date: document.getElementById('jEditDate').value.trim(),
            type: document.getElementById('jEditType').value,
            title: title,
            desc: document.getElementById('jEditDesc').value.trim(),
            tags: document.getElementById('jEditTags').value.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (this._insertAfterId) {
            const idx = this.journeyData.findIndex(n => n.id === this._insertAfterId);
            if (idx >= 0) {
                this.journeyData.splice(idx + 1, 0, newNode);
            } else {
                this.journeyData.push(newNode);
            }
        } else {
            this.journeyData.push(newNode);
        }

        this.closeJourneyEdit();
        this.renderJourney();
        this.updateJourneyStats();
        this.refreshHeroDashboard();

        setTimeout(() => this.scrollToJourneyNode(newNode.id), 300);
    }

    deleteJourneyNode(nodeId) {
        const node = this.journeyData.find(n => n.id === nodeId);
        if (!node) return;

        if (!confirm(`确定删除「${node.title}」吗？此操作不可撤销。`)) return;

        const idx = this.journeyData.findIndex(n => n.id === nodeId);
        if (idx >= 0) this.journeyData.splice(idx, 1);

        this.renderJourney();
        this.updateJourneyStats();
        this.refreshHeroDashboard();
    }

    closeJourneyEdit() {
        this.journeyEditOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.editingNodeId = null;
        this._insertAfterId = null;
    }

    // ===== 拖拽排序 =====
    initDragAndDrop() {
        const nodes = this.journeyTimelineTrack.querySelectorAll('.jtl-node');
        const semesterGroups = this.journeyTimelineTrack.querySelectorAll('.jtl-semester-group');

        nodes.forEach(node => {
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', node.dataset.nodeId);
                node.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            node.addEventListener('dragend', () => {
                node.classList.remove('dragging');
                // 移除所有 drop 高亮
                this.journeyTimelineTrack.querySelectorAll('.jtl-node.drop-target, .jtl-semester-group.drop-target').forEach(el => {
                    el.classList.remove('drop-target');
                });
            });

            node.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const draggingNode = this.journeyTimelineTrack.querySelector('.jtl-node.dragging');
                if (!draggingNode || draggingNode === node) return;
                node.classList.add('drop-target');
            });

            node.addEventListener('dragleave', () => {
                node.classList.remove('drop-target');
            });

            node.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                node.classList.remove('drop-target');
                const draggedId = e.dataTransfer.getData('text/plain');
                const targetId = node.dataset.nodeId;
                if (draggedId === targetId) return;
                this._moveJourneyNode(draggedId, targetId);
            });
        });

        // 拖到学期组（空区域）来更改学期
        semesterGroups.forEach(group => {
            group.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                group.classList.add('drop-target');
            });

            group.addEventListener('dragleave', (e) => {
                if (!group.contains(e.relatedTarget)) {
                    group.classList.remove('drop-target');
                }
            });

            group.addEventListener('drop', (e) => {
                e.preventDefault();
                group.classList.remove('drop-target');
                const draggedId = e.dataTransfer.getData('text/plain');
                const targetSemester = group.dataset.semester;
                const nodeData = this.journeyData.find(n => n.id === draggedId);
                if (nodeData) {
                    nodeData.semester = targetSemester;
                    this.renderJourney();
                    this.updateJourneyStats();
                }
            });
        });
    }

    _moveJourneyNode(draggedId, targetId) {
        const fromIdx = this.journeyData.findIndex(n => n.id === draggedId);
        const toIdx = this.journeyData.findIndex(n => n.id === targetId);
        if (fromIdx < 0 || toIdx < 0) return;

        const [moved] = this.journeyData.splice(fromIdx, 1);
        // 如果拖到同一个学期，调整顺序；如果跨学期，更新学期
        const targetNode = this.journeyData[toIdx > fromIdx ? toIdx - 1 : toIdx];
        moved.semester = targetNode.semester;
        this.journeyData.splice(toIdx > fromIdx ? toIdx : toIdx + 1, 0, moved);
        this.renderJourney();
        this.updateJourneyStats();
    }

    updateJourneyStats() {
        const projects = this.journeyData.filter(n => n.type === 'project').length;
        const internships = this.journeyData.filter(n => n.type === 'internship').length;
        const scholarships = this.journeyData.filter(n => n.type === 'scholarship').length;
        const courses = this.journeyData.filter(n => n.type === 'course').length;

        const statProjects = document.getElementById('jStatProjects');
        const statInternships = document.getElementById('jStatInternships');
        const statScholarships = document.getElementById('jStatScholarships');
        const statCourses = document.getElementById('jStatCourses');

        if (statProjects) this.animateStatNumber(statProjects, projects);
        if (statInternships) this.animateStatNumber(statInternships, internships);
        if (statScholarships) this.animateStatNumber(statScholarships, scholarships);
        if (statCourses) this.animateStatNumber(statCourses, courses);
    }

    animateStatNumber(el, target) {
        const current = parseInt(el.textContent) || 0;
        if (current === target) return;
        const duration = 600;
        const start = performance.now();
        const from = current;
        const to = target;
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(from + (to - from) * eased);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== Growth Mission 系统 =====
    setupMission() {
        this.missionCards = document.getElementById('missionCards');
        this.missionEmpty = document.getElementById('missionEmpty');
        this.missionPeriod = document.getElementById('missionPeriod');
        this.currentPhase = 'active';

        // Checkin overlay
        this.checkinOverlay = document.getElementById('missionCheckinOverlay');
        this.checkinContent = document.getElementById('missionCheckinContent');
        this.checkinClose = document.getElementById('missionCheckinClose');
        this.checkinBackdrop = this.checkinOverlay.querySelector('.mission-modal-backdrop');

        // Detail overlay
        this.detailOverlay = document.getElementById('missionDetailOverlay');
        this.detailContent = document.getElementById('missionDetailContent');
        this.detailClose = document.getElementById('missionDetailClose');
        this.detailBackdrop = this.detailOverlay.querySelector('.mission-modal-backdrop');

        // Mission data with check-in and evaluation support
        this.missionData = [
            {
                id: 'm1', phase: 'active', title: '完成机器学习工程实战项目',
                smart: {
                    S: '使用真实数据集完成端到端ML项目（数据清洗→建模→部署）',
                    M: '输出GitHub仓库 + 技术博客文章',
                    A: '已有Python和ML理论基础，可借助Kaggle数据集完成',
                    R: '补齐ML工程落地短板，丰富作品集',
                    T: '2026-06-30 前完成'
                },
                progress: 40, status: 'ongoing',
                checkins: [
                    { date: '2026-06-10', note: '确定数据集和问题定义，完成EDA', progress: 20 },
                    { date: '2026-06-14', note: '完成特征工程和基线模型训练', progress: 40 }
                ],
                evaluation: null,
                deadline: '2026-06-30',
                tags: ['机器学习', '工程实践']
            },
            {
                id: 'm2', phase: 'pending', title: '投递腾讯暑期实习岗位',
                smart: {
                    S: '完善简历并投递至少5个目标岗位',
                    M: '获得至少2个面试邀请',
                    A: '简历已有基础，策略产品实习经验是优势',
                    R: '直接推动腾讯校招进程',
                    T: '2026-07-15 前完成'
                },
                progress: 0, status: 'todo',
                checkins: [],
                evaluation: null,
                deadline: '2026-07-15',
                tags: ['求职', '投递']
            },
            {
                id: 'm3', phase: 'pending', title: '完成2次模拟面试',
                smart: {
                    S: '技术面 + 产品面各1次',
                    M: '获得反馈评分 ≥ 70分',
                    A: '可联系学长或使用AI模拟面试工具',
                    R: '为腾讯实习面试做准备',
                    T: '2026-07-10 前完成'
                },
                progress: 0, status: 'todo',
                checkins: [],
                evaluation: null,
                deadline: '2026-07-10',
                tags: ['面试', '软技能']
            },
            {
                id: 'm4', phase: 'completed', title: '整理策略产品实习作品集',
                smart: {
                    S: '将3段策略产品实习经历整理为标准作品集',
                    M: '输出3份项目总结 + 量化成果数据',
                    A: '已有完整实习经历，只需整理包装',
                    R: '直接用于简历和面试展示',
                    T: '2026-05-30 前完成'
                },
                progress: 100, status: 'completed',
                checkins: [
                    { date: '2026-05-10', note: '完成第一段实习经历的整理和量化', progress: 35 },
                    { date: '2026-05-20', note: '完成第二段实习经历整理', progress: 70 },
                    { date: '2026-05-28', note: '全部3段实习经历整理完成', progress: 100 }
                ],
                evaluation: { score: 88, comment: '作品集质量高，量化成果清晰。建议在面试中重点展示AI产品经验和数据驱动决策的案例。', date: '2026-06-02' },
                deadline: '2026-05-30',
                completedAt: '2026-05-28',
                tags: ['作品集', '求职准备']
            },
            {
                id: 'm5', phase: 'archive', title: '完成SQL能力系统提升',
                smart: {
                    S: '系统学习SQL高级查询，包括窗口函数、CTE、索引优化',
                    M: '完成LeetCode SQL 50题并整理错题笔记',
                    A: '有数据库课程基础，可每日刷2-3题',
                    R: '数据分析师面试核心技能',
                    T: '2026-04-15 前完成'
                },
                progress: 100, status: 'completed',
                checkins: [
                    { date: '2026-03-20', note: '完成前20题，简单和中等难度', progress: 40 },
                    { date: '2026-04-01', note: '完成到40题，开始整理错题', progress: 80 },
                    { date: '2026-04-12', note: '全部完成！错题笔记整理完毕', progress: 100 }
                ],
                evaluation: { score: 92, comment: 'SQL能力显著提升，复杂查询和优化思路清晰。结合数据库课程基础，SQL已是你的核心竞争力。', date: '2026-04-18' },
                deadline: '2026-04-15',
                completedAt: '2026-04-12',
                archivedAt: '2026-05-01',
                tags: ['SQL', '基础巩固']
            }
        ];

        // Phase tabs
        this.phaseTabs = document.querySelectorAll('#missionPhaseTabs .mp-tab');
        this.phaseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.phaseTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentPhase = tab.dataset.phase;
                this.renderMissions();
            });
        });

        // Checkin overlay events
        this.checkinClose.addEventListener('click', () => this.closeCheckinOverlay());
        this.checkinBackdrop.addEventListener('click', () => this.closeCheckinOverlay());

        // Detail overlay events
        this.detailClose.addEventListener('click', () => this.closeDetailOverlay());
        this.detailBackdrop.addEventListener('click', () => this.closeDetailOverlay());

        // Keyboard close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.checkinOverlay.classList.contains('active')) this.closeCheckinOverlay();
                if (this.detailOverlay.classList.contains('active')) this.closeDetailOverlay();
            }
        });

        // Empty state add button
        document.getElementById('emptyAddMission').addEventListener('click', () => {
            this.openMissionCreate();
        });

        // Next cycle button
        const nextCycleBtn = document.getElementById('viewNextCycleBtn');
        if (nextCycleBtn) {
            nextCycleBtn.addEventListener('click', () => {
                this.openNextCycleDetail();
            });
        }

        this.renderMissions();
    }

    renderMissions() {
        const missions = this.missionData.filter(m => m.phase === this.currentPhase);

        if (missions.length === 0) {
            this.missionCards.style.display = 'none';
            this.missionEmpty.style.display = 'flex';
            if (this.missionPeriod) {
                this.missionPeriod.style.display = this.currentPhase === 'active' ? 'block' : 'none';
            }
            return;
        }

        this.missionCards.style.display = 'flex';
        this.missionEmpty.style.display = 'none';
        if (this.missionPeriod) {
            this.missionPeriod.style.display = (this.currentPhase === 'active' || this.currentPhase === 'pending') ? 'block' : 'none';
        }

        let html = '';
        missions.forEach(m => {
            const isArchived = m.phase === 'archive';
            const statusClass = m.status === 'ongoing' ? 'ongoing' : (m.status === 'completed' ? 'completed' : 'todo');
            const statusText = m.status === 'ongoing' ? '进行中' : (m.status === 'completed' ? '已完成' : '待开始');
            const phaseLabel = m.phase === 'archive' ? '已归档' : (m.phase === 'completed' ? '已完成' : (m.phase === 'active' ? '当前周期' : '待开始'));

            html += `
                <div class="mission-card ${statusClass}" data-mission-id="${m.id}" data-animate>
                    <div class="mission-card-phase-strip"></div>
                    <div class="mission-card-header">
                        <div class="mission-phase-badge ${m.phase}">${phaseLabel}</div>
                        <span class="mission-deadline ${m.progress >= 100 ? 'met' : (this._daysUntil(m.deadline) <= 3 ? 'urgent' : '')}">
                            ${m.progress >= 100 ? '✓ 已完成' : '⏱ ' + m.deadline}
                        </span>
                    </div>
                    <div class="mission-content">
                        <h4>${m.title}</h4>
                        <div class="mission-tags-row">
                            ${m.tags.map(t => `<span class="mission-tag-chip">${t}</span>`).join('')}
                        </div>
                        <div class="mission-smart">
                            ${Object.entries(m.smart).map(([k, v]) => `<span><strong>${k}:</strong> ${v}</span>`).join('')}
                        </div>
                    </div>
                    <div class="mission-progress-area">
                        <div class="mission-progress">
                            <div class="progress-bar">
                                <div class="progress-fill ${m.progress >= 100 ? 'completed' : ''}" style="width:${m.progress}%"></div>
                            </div>
                            <span class="progress-text">${m.progress}%</span>
                        </div>
                        ${m.evaluation ? `
                        <div class="mission-eval-preview">
                            <span class="eval-star">★</span>
                            <span class="eval-score">${m.evaluation.score}分</span>
                            <span class="eval-date">${m.evaluation.date}</span>
                        </div>` : ''}
                    </div>
                    <div class="mission-actions">
                        ${this.currentPhase === 'active' && m.status === 'ongoing' ? `
                            <button class="mission-action-btn primary" data-action="checkin" data-mission-id="${m.id}">📝 打卡</button>
                            <button class="mission-action-btn" data-action="detail" data-mission-id="${m.id}">详情</button>
                        ` : ''}
                        ${this.currentPhase === 'pending' && m.status === 'todo' ? `
                            <button class="mission-action-btn primary" data-action="start" data-mission-id="${m.id}">▶ 开始任务</button>
                            <button class="mission-action-btn" data-action="detail" data-mission-id="${m.id}">详情</button>
                        ` : ''}
                        ${(m.phase === 'completed' || m.phase === 'archive') ? `
                            <button class="mission-action-btn" data-action="detail" data-mission-id="${m.id}">查看详情</button>
                            <button class="mission-action-btn" data-action="evaluate" data-mission-id="${m.id}">${m.evaluation ? '📊 查看评估' : '✏️ 评估'}</button>
                            ${m.phase === 'completed' ? `
                            <button class="mission-action-btn" data-action="archive" data-mission-id="${m.id}">📦 归档</button>
                            ` : ''}
                        ` : ''}
                        ${m.status === 'ongoing' && m.phase === 'active' ? `
                            <button class="mission-action-btn" data-action="complete" data-mission-id="${m.id}">✓ 完成</button>
                        ` : ''}
                    </div>
                    ${m.checkins && m.checkins.length > 0 ? `
                    <div class="mission-checkin-history">
                        <span class="checkin-history-label">打卡记录</span>
                        <div class="checkin-history-list">
                            ${m.checkins.slice(-2).map(c => `
                                <div class="checkin-history-item">
                                    <span class="chi-date">${c.date}</span>
                                    <span class="chi-note">${c.note}</span>
                                    <span class="chi-progress">+${c.progress}%</span>
                                </div>
                            `).join('')}
                            ${m.checkins.length > 2 ? `<span class="checkin-more">共${m.checkins.length}条记录</span>` : ''}
                        </div>
                    </div>` : ''}
                </div>
            `;
        });

        this.missionCards.innerHTML = html;

        // Bind action buttons
        this.missionCards.querySelectorAll('.mission-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const missionId = btn.dataset.missionId;
                this.handleMissionAction(action, missionId);
            });
        });

        // Click card to view detail
        this.missionCards.querySelectorAll('.mission-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.mission-action-btn')) return;
                const missionId = card.dataset.missionId;
                this.openMissionDetail(missionId);
            });
        });

        // Re-trigger animation
        setTimeout(() => {
            this.missionCards.querySelectorAll('[data-animate]').forEach(el => {
                el.classList.add('visible');
            });
            this.animateMissionBars();
        }, 50);

        this.updateCycleProgress();
    }

    handleMissionAction(action, missionId) {
        const mission = this.missionData.find(m => m.id === missionId);
        if (!mission) return;

        switch (action) {
            case 'checkin':
                this.openCheckinOverlay(missionId);
                break;
            case 'detail':
                this.openMissionDetail(missionId);
                break;
            case 'start':
                mission.phase = 'active';
                mission.status = 'ongoing';
                mission.progress = 5;
                this.currentPhase = 'active';
                this.phaseTabs.forEach(t => t.classList.remove('active'));
                const activeTab = document.querySelector('#missionPhaseTabs .mp-tab[data-phase="active"]');
                if (activeTab) activeTab.classList.add('active');
                this.renderMissions();
                this.refreshHeroDashboard();
                this._gooseCelebrate('start', mission);
                break;
            case 'complete':
                if (confirm(`确定将「${mission.title}」标记为完成吗？`)) {
                    mission.status = 'completed';
                    mission.progress = 100;
                    mission.completedAt = this._today();
                    mission.phase = 'completed';
                    // Add auto checkin
                    mission.checkins.push({
                        date: this._today(),
                        note: '任务完成',
                        progress: 100 - (mission.checkins.length > 0 ? mission.checkins[mission.checkins.length - 1].progress : 0)
                    });
                    this.renderMissions();
                    this.refreshHeroDashboard();
                    this._gooseCelebrate('complete', mission);
                }
                break;
            case 'archive':
                if (confirm(`确定将「${mission.title}」归档吗？归档后可在归档记录中查看。`)) {
                    mission.phase = 'archive';
                    mission.archivedAt = this._today();
                    this.renderMissions();
                    this.refreshHeroDashboard();
                }
                break;
            case 'evaluate':
                this.openEvaluateOverlay(missionId);
                break;
        }
    }

    openCheckinOverlay(missionId) {
        const mission = this.missionData.find(m => m.id === missionId);
        if (!mission) return;

        const lastCheckin = mission.checkins.length > 0 ? mission.checkins[mission.checkins.length - 1] : null;
        const currentProgress = mission.progress;

        const html = `
            <div class="checkin-header">
                <span class="checkin-header-icon">📝</span>
                <div>
                    <h3>任务打卡</h3>
                    <p>${mission.title}</p>
                </div>
            </div>
            <div class="checkin-body">
                <div class="checkin-current-progress">
                    <span class="ccp-label">当前进度</span>
                    <span class="ccp-value">${currentProgress}%</span>
                </div>
                <div class="checkin-form-group">
                    <label>更新进度 (%)</label>
                    <div class="checkin-progress-input">
                        <input type="range" id="checkinProgress" min="${currentProgress}" max="100" value="${Math.min(currentProgress + 15, 100)}" step="5">
                        <span class="checkin-progress-value" id="checkinProgressVal">${Math.min(currentProgress + 15, 100)}%</span>
                    </div>
                </div>
                <div class="checkin-form-group">
                    <label>打卡备注</label>
                    <textarea id="checkinNote" placeholder="记录今天做了什么...&#10;例如：完成了5道LeetCode SQL Hard题目"></textarea>
                </div>
                ${lastCheckin ? `
                <div class="checkin-last-record">
                    <span>上次打卡：${lastCheckin.date} — ${lastCheckin.note}</span>
                </div>` : ''}
            </div>
            <div class="checkin-actions">
                <button class="checkin-btn cancel" id="checkinCancelBtn">取消</button>
                <button class="checkin-btn confirm" id="checkinConfirmBtn">确认打卡 ✓</button>
            </div>
        `;

        this.checkinContent.innerHTML = html;
        this.checkinOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this._checkinMissionId = missionId;

        // Range slider sync
        const range = document.getElementById('checkinProgress');
        const rangeVal = document.getElementById('checkinProgressVal');
        range.addEventListener('input', () => {
            rangeVal.textContent = range.value + '%';
        });

        // Buttons
        document.getElementById('checkinCancelBtn').addEventListener('click', () => this.closeCheckinOverlay());
        document.getElementById('checkinConfirmBtn').addEventListener('click', () => this.confirmCheckin());
    }

    confirmCheckin() {
        const mission = this.missionData.find(m => m.id === this._checkinMissionId);
        if (!mission) return;

        const newProgress = parseInt(document.getElementById('checkinProgress').value);
        const note = document.getElementById('checkinNote').value.trim();

        if (!note) {
            alert('请填写打卡备注');
            return;
        }

        const progressIncrement = newProgress - mission.progress;
        const wasCompleted = mission.status === 'completed';
        mission.progress = newProgress;
        mission.checkins.push({
            date: this._today(),
            note: note,
            progress: progressIncrement
        });

        // Auto-complete if 100%
        let justCompleted = false;
        if (mission.progress >= 100 && !wasCompleted) {
            mission.status = 'completed';
            mission.phase = 'completed';
            mission.completedAt = this._today();
            justCompleted = true;
        }

        this.closeCheckinOverlay();
        this.renderMissions();
        this.refreshHeroDashboard();

        // 未来鹅情感反馈
        if (justCompleted) {
            this._gooseCelebrate('complete', mission);
        } else {
            this._gooseCelebrate('checkin', mission);
        }
    }

    closeCheckinOverlay() {
        this.checkinOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this._checkinMissionId = null;
    }

    openMissionDetail(missionId) {
        const mission = this.missionData.find(m => m.id === missionId);
        if (!mission) return;

        const smartHtml = Object.entries(mission.smart).map(([k, v]) => `
            <div class="md-smart-item"><strong>${k}</strong><span>${v}</span></div>
        `).join('');

        const checkinHtml = mission.checkins.length > 0 ? `
            <div class="md-section">
                <h4>打卡记录</h4>
                <div class="md-checkin-timeline">
                    ${mission.checkins.map(c => `
                        <div class="md-checkin-item">
                            <div class="md-checkin-dot"></div>
                            <div class="md-checkin-info">
                                <span class="md-checkin-date">${c.date}</span>
                                <span class="md-checkin-note">${c.note}</span>
                            </div>
                            <span class="md-checkin-progress">${c.progress}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const evalHtml = mission.evaluation ? `
            <div class="md-section">
                <h4>任务评估</h4>
                <div class="md-eval-card">
                    <div class="md-eval-score-wrap">
                        <span class="md-eval-big-score">${mission.evaluation.score}</span>
                        <span class="md-eval-unit">分</span>
                    </div>
                    <div class="md-eval-info">
                        <span class="md-eval-date">评估日期：${mission.evaluation.date}</span>
                        <p class="md-eval-comment">"${mission.evaluation.comment}"</p>
                    </div>
                </div>
            </div>
        ` : '';

        const html = `
            <div class="md-header">
                <span class="md-status-badge ${mission.status}">${mission.status === 'ongoing' ? '进行中' : (mission.status === 'completed' ? '已完成' : '待开始')}</span>
                <h3>${mission.title}</h3>
                <div class="md-meta">
                    <span>截止：${mission.deadline}</span>
                    ${mission.completedAt ? `<span>完成于：${mission.completedAt}</span>` : ''}
                    ${mission.archivedAt ? `<span>归档于：${mission.archivedAt}</span>` : ''}
                </div>
            </div>
            <div class="md-section">
                <h4>SMART 目标</h4>
                <div class="md-smart-grid">${smartHtml}</div>
            </div>
            <div class="md-section">
                <h4>完成进度</h4>
                <div class="md-progress-wrap">
                    <div class="md-progress-bar">
                        <div class="md-progress-fill ${mission.progress >= 100 ? 'completed' : ''}" style="width:${mission.progress}%"></div>
                    </div>
                    <span class="md-progress-text">${mission.progress}%</span>
                </div>
            </div>
            ${evalHtml}
            ${checkinHtml}
            <div class="md-actions">
                ${mission.status === 'ongoing' ? `<button class="mission-action-btn primary" data-action="checkin" data-mission-id="${mission.id}">📝 打卡</button>` : ''}
                <button class="mission-action-btn secondary" id="mdCloseBtn">关闭</button>
            </div>
        `;

        this.detailContent.innerHTML = html;
        this.detailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('mdCloseBtn').addEventListener('click', () => this.closeDetailOverlay());

        // Re-bind action buttons in detail
        this.detailContent.querySelectorAll('.mission-action-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const mid = btn.dataset.missionId;
                this.closeDetailOverlay();
                setTimeout(() => this.handleMissionAction(action, mid), 200);
            });
        });

        // Animate progress bar
        setTimeout(() => {
            const fill = this.detailContent.querySelector('.md-progress-fill');
            if (fill) {
                const tw = fill.style.width;
                fill.style.width = '0%';
                fill.style.transition = 'none';
                setTimeout(() => {
                    fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    fill.style.width = tw;
                }, 80);
            }
        }, 100);
    }

    closeDetailOverlay() {
        this.detailOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    openEvaluateOverlay(missionId) {
        const mission = this.missionData.find(m => m.id === missionId);
        if (!mission) return;

        if (mission.evaluation) {
            // View existing evaluation
            this.openMissionDetail(missionId);
            return;
        }

        const html = `
            <div class="checkin-header">
                <span class="checkin-header-icon">✏️</span>
                <div>
                    <h3>任务评估</h3>
                    <p>${mission.title}</p>
                </div>
            </div>
            <div class="checkin-body">
                <div class="checkin-form-group">
                    <label>综合评分 (0-100)</label>
                    <div class="checkin-progress-input">
                        <input type="range" id="evalScore" min="0" max="100" value="80" step="1">
                        <span class="checkin-progress-value" id="evalScoreVal">80分</span>
                    </div>
                </div>
                <div class="checkin-form-group">
                    <label>评估意见</label>
                    <textarea id="evalComment" placeholder="写一段评估意见...&#10;例如：整体完成质量很高，SQL能力提升明显..."></textarea>
                </div>
            </div>
            <div class="checkin-actions">
                <button class="checkin-btn cancel" id="evalCancelBtn">取消</button>
                <button class="checkin-btn confirm" id="evalConfirmBtn">提交评估</button>
            </div>
        `;

        this.checkinContent.innerHTML = html;
        this.checkinOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this._checkinMissionId = missionId;

        const range = document.getElementById('evalScore');
        const rangeVal = document.getElementById('evalScoreVal');
        range.addEventListener('input', () => { rangeVal.textContent = range.value + '分'; });

        document.getElementById('evalCancelBtn').addEventListener('click', () => this.closeCheckinOverlay());
        document.getElementById('evalConfirmBtn').addEventListener('click', () => this.confirmEvaluate());
    }

    confirmEvaluate() {
        const mission = this.missionData.find(m => m.id === this._checkinMissionId);
        if (!mission) return;

        const score = parseInt(document.getElementById('evalScore').value);
        const comment = document.getElementById('evalComment').value.trim();

        if (!comment) {
            alert('请填写评估意见');
            return;
        }

        mission.evaluation = {
            score: score,
            comment: comment,
            date: this._today()
        };

        this.closeCheckinOverlay();
        this.renderMissions();
        this.refreshHeroDashboard();
        this._gooseCelebrate('evaluate', mission);
    }

    openMissionCreate() {
        const html = `
            <div class="checkin-header">
                <span class="checkin-header-icon">➕</span>
                <div>
                    <h3>创建新任务</h3>
                    <p>填写SMART目标信息</p>
                </div>
            </div>
            <div class="checkin-body">
                <div class="checkin-form-group">
                    <label>任务标题</label>
                    <input type="text" id="newMissionTitle" placeholder="例如：学习机器学习基础">
                </div>
                <div class="checkin-form-group">
                    <label>S - 具体目标</label>
                    <input type="text" id="newMissionS" placeholder="具体要达成什么？">
                </div>
                <div class="checkin-form-group">
                    <label>M - 衡量标准</label>
                    <input type="text" id="newMissionM" placeholder="如何衡量完成？">
                </div>
                <div class="checkin-form-group">
                    <label>A - 可达成性</label>
                    <input type="text" id="newMissionA" placeholder="为什么可以达成？">
                </div>
                <div class="checkin-form-group">
                    <label>R - 相关性</label>
                    <input type="text" id="newMissionR" placeholder="与职业目标的关系？">
                </div>
                <div class="checkin-form-group">
                    <label>T - 截止时间</label>
                    <input type="text" id="newMissionT" placeholder="例如：2026-07-15 前完成">
                </div>
                <div class="checkin-form-group">
                    <label>标签（逗号分隔）</label>
                    <input type="text" id="newMissionTags" placeholder="Python, 数据分析">
                </div>
                <div class="checkin-form-group">
                    <label>截止日期</label>
                    <input type="text" id="newMissionDeadline" placeholder="例如：2026-07-15">
                </div>
            </div>
            <div class="checkin-actions">
                <button class="checkin-btn cancel" id="createCancelBtn">取消</button>
                <button class="checkin-btn confirm" id="createConfirmBtn">创建任务</button>
            </div>
        `;

        this.checkinContent.innerHTML = html;
        this.checkinOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('createCancelBtn').addEventListener('click', () => this.closeCheckinOverlay());
        document.getElementById('createConfirmBtn').addEventListener('click', () => this.confirmCreateMission());
    }

    confirmCreateMission() {
        const title = document.getElementById('newMissionTitle').value.trim();
        if (!title) { alert('请输入任务标题'); return; }

        const newMission = {
            id: 'm' + Date.now(),
            phase: 'pending',
            title: title,
            smart: {
                S: document.getElementById('newMissionS').value.trim() || '待定义',
                M: document.getElementById('newMissionM').value.trim() || '待定义',
                A: document.getElementById('newMissionA').value.trim() || '待定义',
                R: document.getElementById('newMissionR').value.trim() || '待定义',
                T: document.getElementById('newMissionT').value.trim() || '待定义'
            },
            progress: 0,
            status: 'todo',
            checkins: [],
            evaluation: null,
            deadline: document.getElementById('newMissionDeadline').value.trim() || '待定',
            tags: document.getElementById('newMissionTags').value.split(',').map(t => t.trim()).filter(Boolean)
        };

        this.missionData.push(newMission);
        this.closeCheckinOverlay();

        // Switch to pending tab to show the new mission
        this.currentPhase = 'pending';
        this.phaseTabs.forEach(t => t.classList.remove('active'));
        const pendingTab = document.querySelector('#missionPhaseTabs .mp-tab[data-phase="pending"]');
        if (pendingTab) pendingTab.classList.add('active');
        this.renderMissions();
    }

    openNextCycleDetail() {
        const html = `
            <div class="md-header">
                <span class="md-status-badge ongoing">预告</span>
                <h3>下一周期计划</h3>
                <div class="md-meta">
                    <span>2026.06.29 — 2026.07.12</span>
                </div>
            </div>
            <div class="md-section">
                <h4>计划概要</h4>
                <p style="font-size:14px;line-height:1.8;color:var(--text-secondary);">
                    基于你当前ML工程能力（40%→目标80%）和实习投递需求，下一周期将聚焦三个方向：
                </p>
            </div>
            <div class="md-section">
                <h4>核心任务</h4>
                <div class="md-smart-grid">
                    <div class="md-smart-item"><strong>1</strong><span>ML项目收尾 — 完成模型部署和博客文章</span></div>
                    <div class="md-smart-item"><strong>2</strong><span>A/B测试实战 — 结合策略产品经验设计实验方案</span></div>
                    <div class="md-smart-item"><strong>3</strong><span>简历投递启动 — 突出AI产品+策略实习的复合背景</span></div>
                </div>
            </div>
            <div class="md-section">
                <h4>预期成果</h4>
                <p style="font-size:14px;line-height:1.8;color:var(--text-secondary);">
                    完成后你将具备：1个完整ML项目作品 + 1个A/B测试案例 + 一份突出策略产品+AI经验的优化简历。这将使你的综合竞争力从78%提升至约85%。
                </p>
            </div>
            <div class="md-actions">
                <button class="mission-action-btn secondary" id="ncCloseBtn">关闭</button>
            </div>
        `;

        this.detailContent.innerHTML = html;
        this.detailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('ncCloseBtn').addEventListener('click', () => this.closeDetailOverlay());
    }

    updateCycleProgress() {
        const activeMissions = this.missionData.filter(m => m.phase === 'active');
        const totalProgress = activeMissions.reduce((sum, m) => sum + m.progress, 0);
        const avg = activeMissions.length > 0 ? Math.round(totalProgress / activeMissions.length) : 0;

        const progressEl = document.getElementById('cycleProgress');
        const barEl = document.getElementById('cycleProgressBar');
        if (progressEl) progressEl.textContent = avg + '%';
        if (barEl) barEl.style.width = avg + '%';
    }

    _daysUntil(dateStr) {
        if (!dateStr || dateStr === '待定') return 999;
        const parts = dateStr.split('-');
        const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const now = new Date();
        return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    }

    _today() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new FutureGoApp();

    // 初始触发 Hero 区域动画
    setTimeout(() => {
        app.animateClarityScore();
        document.querySelectorAll('#hero [data-animate]').forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
});
