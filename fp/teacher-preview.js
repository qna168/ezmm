(function () {
  var students = [
    { id: 1, name: "8888", status: "正常" },
    { id: 2, name: "帳號(測試用)", status: "正常" },
    { id: 3, name: "test3", status: "正常" },
    { id: 4, name: "test4", status: "正常" },
    { id: 5, name: "小安", status: "正常" },
    { id: 6, name: "小羽", status: "正常" },
    { id: 7, name: "阿哲", status: "正常" },
    { id: 8, name: "小魚", status: "正常" }
  ];

  function makeState() {
    return {
      tab: "questions",
      modal: null,
      form: {
        type: "choice",
        title: "今天最想先做哪個暖身活動？",
        hours: 0,
        minutes: 30,
        options: ["老師先示範一次", "分組搶答暖身"],
        targetIds: [1, 2, 3, 4, 6]
      },
      questions: [
        {
          id: 301,
          type: "text",
          title: "請用一句話寫下今天最大的收穫",
          statusText: "停止收件 | 已收 3 筆",
          targetIds: [1, 2, 3, 4, 6],
          createdAt: "2026/4/8 09:00:00",
          rankingVisible: false,
          answers: [
            {
              studentId: 1,
              content:
                "先看清楚規則，再作答比較穩。這樣比較不會一路朝錯方向修改，也比較知道每一步是在做什麼。",
              submittedAt: "2026/4/8 09:12:06",
              teacherComment: "這句整理得很好。"
            },
            {
              studentId: 3,
              content:
                "原來先確認題型，答案會比較不亂，而且知道哪邊要短答、哪邊要看整體流程。",
              submittedAt: "2026/4/8 09:14:22",
              teacherComment: ""
            },
            {
              studentId: 6,
              content:
                "今天最大的收穫是不要急著送出，先想清楚修改方向，後面會省很多重工時間。",
              submittedAt: "2026/4/8 09:19:31",
              teacherComment: "這個觀念很重要。"
            }
          ]
        },
        {
          id: 302,
          type: "choice",
          title: "明天暖身活動想先做哪一種？",
          statusText: "停止收件 | 已收 7 筆",
          targetIds: [1, 2, 3, 4, 5, 6],
          createdAt: "2026/4/8 09:20:00",
          rankingVisible: true,
          options: [
            { key: "A", text: "老師先示範" },
            { key: "B", text: "小考檢討" },
            { key: "C", text: "分組討論" },
            { key: "D", text: "個人速答" },
            { key: "E", text: "直接進入新進度" }
          ],
          answers: [
            { studentId: 1, choiceKey: "A", submittedAt: "2026/4/8 09:25:03", teacherComment: "你偏好先看一次流程。" },
            { studentId: 2, choiceKey: "B", submittedAt: "2026/4/8 09:26:11", teacherComment: "" },
            { studentId: 3, choiceKey: "A", submittedAt: "2026/4/8 09:27:19", teacherComment: "你很快就做出選擇。" },
            { studentId: 4, choiceKey: "C", submittedAt: "2026/4/8 09:29:08", teacherComment: "" },
            { studentId: 5, choiceKey: "D", submittedAt: "2026/4/8 09:30:44", teacherComment: "" },
            { studentId: 6, choiceKey: "A", submittedAt: "2026/4/8 09:31:32", teacherComment: "已收到，你的偏好很穩定。" },
            {
              studentId: 8,
              choiceKey: "E",
              submittedAt: "2026/4/8 09:18:10",
              teacherComment: "這位學生後來被移出對象，但仍保留只讀查看權。"
            }
          ]
        }
      ]
    };
  }

  var state = makeState();
  var ui = {
    initView: document.getElementById("initView"),
    questionsView: document.getElementById("questionsView"),
    searchView: document.getElementById("searchView"),
    studentsView: document.getElementById("studentsView"),
    questionToolForm: document.getElementById("questionToolForm"),
    questionList: document.getElementById("questionList"),
    questionEmpty: document.getElementById("questionEmpty"),
    searchList: document.getElementById("searchList"),
    searchEmpty: document.getElementById("searchEmpty"),
    searchEmptyText: document.getElementById("searchEmptyText"),
    studentCount: document.getElementById("studentCount"),
    studentList: document.getElementById("studentList"),
    studentEmpty: document.getElementById("studentEmpty"),
    managePrevBtn: document.getElementById("managePrevBtn"),
    manageNextBtn: document.getElementById("manageNextBtn"),
    managePageInfo: document.getElementById("managePageInfo"),
    searchPrevBtn: document.getElementById("searchPrevBtn"),
    searchNextBtn: document.getElementById("searchNextBtn"),
    searchPageInfo: document.getElementById("searchPageInfo"),
    tabQuestions: document.getElementById("tabQuestions"),
    tabSearch: document.getElementById("tabSearch"),
    tabStudents: document.getElementById("tabStudents"),
    refreshBtn: document.getElementById("refreshTeacherBtn"),
    settingsBtn: document.getElementById("openManageBtn"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    modalBody: document.getElementById("modalBody"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    modalActionBtn: document.getElementById("modalActionBtn")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function optionKey(index) {
    return String.fromCharCode(65 + index);
  }

  function truncateText(value, maxLength) {
    var text = String(value || "").trim();
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
  }

  function cloneModal(modal) {
    return modal ? JSON.parse(JSON.stringify(modal)) : null;
  }

  function getQuestion(questionId) {
    return state.questions.find(function (item) {
      return item.id === Number(questionId);
    });
  }

  function getStudent(studentId) {
    return students.find(function (item) {
      return item.id === Number(studentId);
    });
  }

  function getStudentName(studentId) {
    var student = getStudent(studentId);
    return student ? student.name : "未知學生";
  }

  function getQuestionTargetText(targetIds) {
    return targetIds.length ? "已選 " + targetIds.length + " 人" : "未指定";
  }

  function renderTargetModalTitle(modal) {
    return (
      '<span class="preview-modal-title-row"><span class="preview-modal-title-main">指定對象</span><span id="targetCountText" class="preview-modal-title-count">' +
      getQuestionTargetText(modal.targetIds || []) +
      "</span></span>"
    );
  }

  function getChoiceOption(question, choiceKey) {
    if (!question || !question.options) return null;
    return question.options.find(function (item) {
      return item.key === choiceKey;
    });
  }

  function getChoiceCount(question, choiceKey) {
    return question.answers.filter(function (answer) {
      return answer.choiceKey === choiceKey;
    }).length;
  }

  function getAnswer(question, studentId) {
    return question.answers.find(function (item) {
      return item.studentId === Number(studentId);
    });
  }

  function isCommented(answer) {
    return !!String(answer.teacherComment || "").trim();
  }

  function commentButtonText(answer) {
    return isCommented(answer) ? "已評論" : "評論";
  }

  function setTab(tab) {
    state.tab = tab;
    renderViews();
  }

  function openModal(modalState) {
    state.modal = modalState;
    renderModal();
  }

  function closeModal() {
    state.modal = null;
    ui.modalBody.innerHTML = "";
    ui.modalOverlay.classList.add("hidden");
  }

  function goBackModal() {
    if (!state.modal || !state.modal.backModal) {
      closeModal();
      return;
    }
    openModal(cloneModal(state.modal.backModal));
  }

  function renderTargetPicker(modal) {
    return (
      '<div class="preview-target-list">' +
      students
        .map(function (student) {
          var checked = modal.targetIds.indexOf(student.id) >= 0 ? " checked" : "";
          return (
            '<label class="preview-target-row">' +
            '<input type="checkbox" data-role="modal-target-box" data-student-id="' +
            student.id +
            '"' +
            checked +
            " />" +
            "<span><strong>" +
            escapeHtml(student.name) +
            "</strong></span></label>"
          );
        })
        .join("") +
      '</div><div class="preview-modal-actions"><button type="button" class="btn btn-ghost" data-action="modal-select-all">全選</button><button type="button" class="btn btn-gray" data-action="modal-clear-all">清空</button><button type="button" class="btn btn-primary" data-action="modal-save-targets">確認</button></div>'
    );
  }

  function renderTextAnswersModal(question) {
    return (
      '<p class="preview-modal-question">' +
      escapeHtml(question.title) +
      '</p><div class="preview-answer-list">' +
      question.answers
        .map(function (answer, index) {
          return (
            '<article class="preview-answer-card"><p class="preview-answer-rank">第 ' +
            (index + 1) +
            " 名：" +
            escapeHtml(getStudentName(answer.studentId)) +
            '</p><p class="preview-meta">' +
            escapeHtml(answer.submittedAt) +
            '</p><div class="preview-answer-preview-box">' +
            escapeHtml(truncateText(answer.content, 100)) +
            '</div><div class="preview-modal-actions preview-answer-actions"><button type="button" class="btn btn-answer-detail btn-small" data-action="open-answer-detail" data-question-id="' +
            question.id +
            '" data-student-id="' +
            answer.studentId +
            '">展開</button><button type="button" class="btn ' +
            (isCommented(answer) ? "btn-green" : "btn-primary") +
            ' btn-small" data-action="open-comment" data-question-id="' +
            question.id +
            '" data-student-id="' +
            answer.studentId +
            '">' +
            commentButtonText(answer) +
            "</button></div></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderTextAnswerDetailModal(question, answer) {
    return (
      '<p class="preview-modal-question">' +
      escapeHtml(getStudentName(answer.studentId)) +
      '</p><p class="preview-meta">' +
      escapeHtml(answer.submittedAt) +
      '</p><div class="preview-answer-body preview-answer-body-full">' +
      escapeHtml(answer.content) +
      '</div><div class="preview-modal-actions"><button type="button" class="btn btn-ghost" data-action="modal-back">返回</button><button type="button" class="btn ' +
      (isCommented(answer) ? "btn-green" : "btn-primary") +
      '" data-action="open-comment" data-question-id="' +
      question.id +
      '" data-student-id="' +
      answer.studentId +
      '">' +
      commentButtonText(answer) +
      "</button></div>"
    );
  }

  function renderChoiceSummaryModal(question) {
    return (
      '<p class="preview-modal-question">' +
      escapeHtml(question.title) +
      '</p><div class="preview-choice-summary">' +
      question.options
        .map(function (option) {
          return (
            '<button type="button" class="preview-summary-btn preview-choice-card" data-action="open-choice-students" data-question-id="' +
            question.id +
            '" data-choice-key="' +
            escapeHtml(option.key) +
            '"><div class="preview-choice-head"><span class="preview-choice-key">' +
            escapeHtml(option.key) +
            '</span><span class="preview-choice-count">' +
            getChoiceCount(question, option.key) +
            ' 人</span></div><strong class="preview-choice-text">' +
            escapeHtml(option.text) +
            "</strong></button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderChoiceStudentsModal(question, choiceKey) {
    var option = getChoiceOption(question, choiceKey);
    var answers = question.answers.filter(function (answer) {
      return answer.choiceKey === choiceKey;
    });

    return (
      '<div class="preview-modal-actions preview-modal-top"><p class="preview-modal-question">' +
      escapeHtml(choiceKey + " " + (option ? option.text : "")) +
      '</p><button type="button" class="btn btn-ghost btn-small" data-action="modal-back">返回</button></div><div class="preview-answer-list">' +
      (answers.length
        ? answers
            .map(function (answer) {
              return (
                '<article class="preview-answer-card"><p class="preview-answer-rank">' +
                escapeHtml(getStudentName(answer.studentId)) +
                '</p><p class="preview-meta">' +
                escapeHtml(answer.submittedAt) +
                '</p><div class="preview-answer-preview-box"><strong>' +
                escapeHtml(answer.choiceKey) +
                "</strong> " +
                escapeHtml(option ? option.text : "") +
                '</div><div class="preview-modal-actions"><button type="button" class="btn ' +
                (isCommented(answer) ? "btn-green" : "btn-primary") +
                ' btn-small" data-action="open-comment" data-question-id="' +
                question.id +
                '" data-student-id="' +
                answer.studentId +
                '">' +
                commentButtonText(answer) +
                "</button></div></article>"
              );
            })
            .join("")
        : '<p class="preview-empty">目前沒有學生選這個選項。</p>') +
      "</div>"
    );
  }

  function renderCommentModal(question, answer) {
    var answerHtml = "";
    if (question.type === "choice") {
      var option = getChoiceOption(question, answer.choiceKey);
      answerHtml =
        '<div class="preview-answer-body"><strong>' +
        escapeHtml(answer.choiceKey) +
        "</strong> " +
        escapeHtml(option ? option.text : "") +
        "</div>";
    } else {
      answerHtml = '<div class="preview-answer-body preview-answer-body-full">' + escapeHtml(answer.content) + "</div>";
    }

    return (
      '<p class="preview-modal-question">' +
      escapeHtml(getStudentName(answer.studentId)) +
      '</p><p class="preview-meta">' +
      escapeHtml(question.title) +
      '</p><p class="preview-meta">' +
      escapeHtml(answer.submittedAt) +
      '</p>' +
      answerHtml +
      (question.type === "choice" && question.targetIds.indexOf(answer.studentId) < 0
        ? '<p class="preview-readonly-note">這位學生後來被移出指定對象，但仍保留查看。</p>'
        : "") +
      '<textarea id="modalCommentInput" class="preview-comment-input" placeholder="輸入評論...">' +
      escapeHtml(answer.teacherComment || "") +
      '</textarea><div class="preview-modal-actions"><button type="button" class="btn btn-ghost" data-action="modal-back">返回</button><button type="button" class="btn btn-primary" data-action="modal-save-comment">儲存</button></div>'
    );
  }

  function renderQuestionManageModal(question) {
    return (
      '<p class="manage-title">' +
      escapeHtml(question.title) +
      '</p><div class="preview-manage-section"><p class="preview-manage-label">修改時間</p><div class="time-inline"><input id="modalHoursInput" type="number" min="0" value="0" /><span class="time-unit">時</span><span class="time-sep">:</span><input id="modalMinutesInput" type="number" min="0" value="0" /><span class="time-unit">分</span></div><button type="button" class="btn btn-primary">修改時間</button></div><div class="preview-manage-grid"><button type="button" class="btn ' +
      (question.rankingVisible ? "btn-orange" : "btn-gray") +
      '">' +
      (question.rankingVisible ? "顯示排名" : "隱藏排名") +
      '</button><button type="button" class="btn btn-primary" data-action="open-question-targets" data-question-id="' +
      question.id +
      '">指定對象</button></div><div class="preview-manage-meta"><span class="preview-badge">' +
      (question.type === "choice" ? "選擇題" : "問答題") +
      '</span><span class="preview-count">' +
      getQuestionTargetText(question.targetIds) +
      '</span></div>' +
      (question.type === "choice"
        ? '<div class="preview-chip-row">' +
          question.options
            .map(function (option) {
              return '<span class="preview-chip">' + escapeHtml(option.key) + "</span>";
            })
            .join("") +
          "</div>"
        : "") +
      '<button type="button" class="btn btn-red">刪除題目</button>'
    );
  }

  function renderSystemSettingsModal() {
    return (
      '<div class="preview-manage-section"><button type="button" class="btn btn-primary" data-action="reset-demo-data">重置資料</button></div>'
    );
  }

  function renderModal() {
    if (!state.modal) {
      closeModal();
      return;
    }

    ui.modalActionBtn.classList.add("hidden");
    ui.modalOverlay.classList.remove("hidden");

    if (state.modal.type === "draft-targets" || state.modal.type === "question-targets") {
      ui.modalTitle.innerHTML = renderTargetModalTitle(state.modal);
      ui.modalBody.innerHTML = renderTargetPicker(state.modal);
      return;
    }

    if (state.modal.type === "system-settings") {
      ui.modalTitle.textContent = "設定";
      ui.modalBody.innerHTML = renderSystemSettingsModal();
      return;
    }

    var question = getQuestion(state.modal.questionId);
    if (!question) {
      closeModal();
      return;
    }

    if (state.modal.type === "text-answers") {
      ui.modalTitle.textContent = "詳細作答內容";
      ui.modalBody.innerHTML = renderTextAnswersModal(question);
      return;
    }

    if (state.modal.type === "text-answer-detail") {
      ui.modalTitle.textContent = "詳細作答內容";
      ui.modalBody.innerHTML = renderTextAnswerDetailModal(question, getAnswer(question, state.modal.studentId));
      return;
    }

    if (state.modal.type === "choice-summary") {
      ui.modalTitle.textContent = "詳細作答內容";
      ui.modalBody.innerHTML = renderChoiceSummaryModal(question);
      return;
    }

    if (state.modal.type === "choice-students") {
      ui.modalTitle.textContent = "詳細作答內容";
      ui.modalBody.innerHTML = renderChoiceStudentsModal(question, state.modal.choiceKey);
      return;
    }

    if (state.modal.type === "comment") {
      ui.modalTitle.textContent = "評論";
      ui.modalBody.innerHTML = renderCommentModal(question, getAnswer(question, state.modal.studentId));
      return;
    }

    if (state.modal.type === "question-manage") {
      ui.modalTitle.textContent = "題目功能";
      ui.modalBody.innerHTML = renderQuestionManageModal(question);
    }
  }

  function renderQuestionComposer() {
    ui.questionToolForm.innerHTML =
      '<div class="preview-form-row preview-form-row-type"><div class="preview-type-switch"><button type="button" class="preview-type-btn ' +
      (state.form.type === "text" ? "active" : "") +
      '" data-action="set-type" data-type="text">問答題</button><button type="button" class="preview-type-btn ' +
      (state.form.type === "choice" ? "active" : "") +
      '" data-action="set-type" data-type="choice">選擇題</button></div></div><div class="field"><label for="previewTitle">發布新題目</label><textarea id="previewTitle" rows="2">' +
      escapeHtml(state.form.title) +
      '</textarea></div>' +
      (state.form.type === "choice"
        ? '<div class="preview-choice-group"><div class="preview-option-list">' +
          state.form.options
            .map(function (text, index) {
              return '<div class="preview-option-row"><span class="preview-option-key">' + optionKey(index) + '</span><input class="preview-option-input" data-option-index="' + index + '" value="' + escapeHtml(text) + '" /></div>';
            })
            .join("") +
          '</div><div class="preview-target-tools"><button type="button" class="preview-mini-btn" data-action="add-option">新增選項</button><button type="button" class="preview-mini-btn ghost" data-action="remove-option">刪除選項</button></div></div>'
        : "") +
      '<div class="preview-target-field"><div class="preview-target-head"><p class="preview-target-label">指定對象</p><p class="preview-count-line">' +
      getQuestionTargetText(state.form.targetIds) +
      '</p></div><button type="button" class="btn btn-green btn-small" data-action="open-draft-targets">選擇</button></div>' +
      '<div class="preview-time-group"><div class="time-inline"><input id="previewHours" type="number" min="0" value="' +
      state.form.hours +
      '" /><span class="time-unit">時</span><span class="time-sep">:</span><input id="previewMinutes" type="number" min="0" value="' +
      state.form.minutes +
      '" /><span class="time-unit">分</span></div><button id="createQuestionBtn" type="button" class="btn btn-primary">發布並倒數</button></div>';
  }

  function renderQuestionCard(question) {
    var title = question.title;
    var typeText = question.type === "choice" ? "選擇題" : "問答題";
    var targetText = getQuestionTargetText(question.targetIds);
    var statusText = question.statusText;
    var createdText = "發布：" + question.createdAt;
    var rankingBtnClass = question.rankingVisible ? "btn btn-orange btn-small" : "btn btn-ranking-off btn-small";

    return (
      '<article class="question-card"><div class="question-top"><span class="question-status closed">' +
      escapeHtml(statusText) +
      '</span><span class="question-visibility">' +
      escapeHtml(targetText) +
      '</span></div><h3 class="question-title">' +
      escapeHtml(title) +
      '</h3><p class="question-meta">' +
      escapeHtml(createdText) +
      (typeText ? " | 題型：" + typeText : "") +
      '</p><div class="action-grid"><button type="button" class="' +
      rankingBtnClass +
      '">排名</button><button type="button" class="btn btn-green btn-small" data-action="open-answers" data-question-id="' +
      question.id +
      '">查看</button><button type="button" class="btn btn-question-manage btn-small" data-action="open-manage" data-question-id="' +
      question.id +
      '">功能</button>' +
      "</div></article>"
    );
  }

  function renderQuestionList() {
    ui.questionEmpty.classList.add("hidden");
    ui.managePrevBtn.classList.add("hidden");
    ui.manageNextBtn.classList.add("hidden");
    ui.managePageInfo.textContent = "";
    ui.questionList.innerHTML = state.questions
      .map(function (question) {
        return renderQuestionCard(question);
      })
      .join("");
  }

  function renderSearchTab() {
    ui.searchList.innerHTML = "";
    ui.searchEmpty.classList.remove("hidden");
    ui.searchEmptyText.textContent = "請輸入關鍵字搜尋題目";
    ui.searchPrevBtn.classList.add("hidden");
    ui.searchNextBtn.classList.add("hidden");
    ui.searchPageInfo.textContent = "";
  }

  function renderStudentsTab() {
    ui.studentCount.textContent = students.length + " 人";
    ui.studentList.innerHTML = students
      .map(function (student) {
        return (
          '<article class="student-card"><div class="student-head"><h3 class="student-name">' +
          escapeHtml(student.name) +
          '</h3><span class="student-state active">' +
          escapeHtml(student.status) +
          '</span></div><div class="student-actions"><button type="button" class="btn btn-primary">查題目</button><button type="button" class="btn btn-gray">管理</button></div></article>'
        );
      })
      .join("");
    ui.studentEmpty.classList.add("hidden");
  }

  function renderViews() {
    ui.initView.classList.add("hidden");
    ui.questionsView.classList.toggle("hidden", state.tab !== "questions");
    ui.searchView.classList.toggle("hidden", state.tab !== "search");
    ui.studentsView.classList.toggle("hidden", state.tab !== "students");
    ui.tabQuestions.classList.toggle("active", state.tab === "questions");
    ui.tabSearch.classList.toggle("active", state.tab === "search");
    ui.tabStudents.classList.toggle("active", state.tab === "students");
  }

  function render() {
    renderViews();
    renderQuestionComposer();
    renderQuestionList();
    renderSearchTab();
    renderStudentsTab();
    if (state.modal) renderModal();
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.dataset.action;

    if (action === "set-type") {
      state.form.type = target.dataset.type === "text" ? "text" : "choice";
      renderQuestionComposer();
      renderQuestionList();
      return;
    }

    if (action === "add-option") {
      state.form.options.push("");
      renderQuestionComposer();
      renderQuestionList();
      return;
    }

    if (action === "remove-option" && state.form.options.length > 2) {
      state.form.options.pop();
      renderQuestionComposer();
      renderQuestionList();
      return;
    }

    if (action === "open-draft-targets") {
      openModal({
        type: "draft-targets",
        targetIds: state.form.targetIds.slice().sort(function (a, b) {
          return a - b;
        })
      });
      return;
    }

    if (action === "open-question-targets") {
      var question = getQuestion(target.dataset.questionId);
      if (!question) return;
      openModal({
        type: "question-targets",
        questionId: question.id,
        targetIds: question.targetIds.slice().sort(function (a, b) {
          return a - b;
        }),
        backModal: { type: "question-manage", questionId: question.id }
      });
      return;
    }

    if (action === "modal-select-all" && state.modal && (state.modal.type === "draft-targets" || state.modal.type === "question-targets")) {
      state.modal.targetIds = students.map(function (student) {
        return student.id;
      });
      renderModal();
      return;
    }

    if (action === "modal-clear-all" && state.modal && (state.modal.type === "draft-targets" || state.modal.type === "question-targets")) {
      state.modal.targetIds = [];
      renderModal();
      return;
    }

    if (action === "modal-save-targets" && state.modal && state.modal.type === "draft-targets") {
      state.form.targetIds = state.modal.targetIds.slice().sort(function (a, b) {
        return a - b;
      });
      closeModal();
      renderQuestionComposer();
      renderQuestionList();
      return;
    }

    if (action === "modal-save-targets" && state.modal && state.modal.type === "question-targets") {
      var editQuestion = getQuestion(state.modal.questionId);
      if (!editQuestion) return;
      editQuestion.targetIds = state.modal.targetIds.slice().sort(function (a, b) {
        return a - b;
      });
      openModal({ type: "question-manage", questionId: editQuestion.id });
      renderQuestionList();
      return;
    }

    if (action === "apply-draft") {
      renderQuestionList();
      return;
    }

    if (action === "open-answers") {
      var questionToView = getQuestion(target.dataset.questionId);
      if (!questionToView) return;
      openModal({
        type: questionToView.type === "choice" ? "choice-summary" : "text-answers",
        questionId: questionToView.id
      });
      return;
    }

    if (action === "open-manage") {
      openModal({
        type: "question-manage",
        questionId: Number(target.dataset.questionId || 0)
      });
      return;
    }

    if (action === "open-answer-detail") {
      openModal({
        type: "text-answer-detail",
        questionId: Number(target.dataset.questionId || 0),
        studentId: Number(target.dataset.studentId || 0),
        backModal: {
          type: "text-answers",
          questionId: Number(target.dataset.questionId || 0)
        }
      });
      return;
    }

    if (action === "open-choice-students") {
      openModal({
        type: "choice-students",
        questionId: Number(target.dataset.questionId || 0),
        choiceKey: target.dataset.choiceKey || "",
        backModal: {
          type: "choice-summary",
          questionId: Number(target.dataset.questionId || 0)
        }
      });
      return;
    }

    if (action === "open-comment") {
      var commentQuestion = getQuestion(target.dataset.questionId);
      if (!commentQuestion) return;
      var commentAnswer = getAnswer(commentQuestion, Number(target.dataset.studentId || 0));
      if (!commentAnswer) return;
      openModal({
        type: "comment",
        questionId: commentQuestion.id,
        studentId: commentAnswer.studentId,
        draftComment: commentAnswer.teacherComment || "",
        backModal: cloneModal(state.modal)
      });
      return;
    }

    if (action === "modal-save-comment" && state.modal && state.modal.type === "comment") {
      var questionForComment = getQuestion(state.modal.questionId);
      if (!questionForComment) return;
      var answerForComment = getAnswer(questionForComment, state.modal.studentId);
      if (!answerForComment) return;
      answerForComment.teacherComment = String(state.modal.draftComment || "");
      if (state.modal.backModal) {
        openModal(state.modal.backModal);
      } else {
        closeModal();
      }
      renderQuestionList();
      return;
    }

    if (action === "modal-back") {
      goBackModal();
      return;
    }

    if (action === "reset-demo-data") {
      state = makeState();
      closeModal();
      render();
    }
  });

  document.addEventListener("input", function (event) {
    var target = event.target;
    if (target.id === "previewTitle") {
      state.form.title = String(target.value || "");
      renderQuestionList();
      return;
    }
    if (target.id === "previewHours") {
      state.form.hours = Number(target.value || 0);
      return;
    }
    if (target.id === "previewMinutes") {
      state.form.minutes = Number(target.value || 0);
      return;
    }
    if (target.classList.contains("preview-option-input")) {
      state.form.options[Number(target.dataset.optionIndex || 0)] = String(target.value || "");
      renderQuestionList();
      return;
    }
    if (target.id === "modalCommentInput" && state.modal && state.modal.type === "comment") {
      state.modal.draftComment = String(target.value || "");
    }
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (target.getAttribute("data-role") === "modal-target-box" && state.modal && (state.modal.type === "draft-targets" || state.modal.type === "question-targets")) {
      var studentId = Number(target.dataset.studentId || 0);
      var exists = state.modal.targetIds.indexOf(studentId) >= 0;
      if (target.checked && !exists) state.modal.targetIds.push(studentId);
      if (!target.checked && exists) {
        state.modal.targetIds = state.modal.targetIds.filter(function (id) {
          return id !== studentId;
        });
      }
      state.modal.targetIds.sort(function (a, b) {
        return a - b;
      });
      if (ui.modalTitle) {
        ui.modalTitle.innerHTML = renderTargetModalTitle(state.modal);
      }
    }
  });

  ui.tabQuestions.addEventListener("click", function () {
    setTab("questions");
  });
  ui.tabSearch.addEventListener("click", function () {
    setTab("search");
  });
  ui.tabStudents.addEventListener("click", function () {
    setTab("students");
  });
  ui.refreshBtn.addEventListener("click", function () {
    state = makeState();
    closeModal();
    render();
  });
  ui.settingsBtn.addEventListener("click", function () {
    openModal({ type: "system-settings" });
  });
  ui.closeModalBtn.addEventListener("click", closeModal);
  ui.modalOverlay.addEventListener("click", function (event) {
    if (event.target === ui.modalOverlay) closeModal();
  });

  render();
})();
