(function () {
  function makeState() {
    return {
      activeStudentId: 1,
      modal: null,
      students: [
        { id: 1, name: "小安" },
        { id: 2, name: "小羽" },
        { id: 8, name: "小魚" }
      ],
      questions: [
        {
          id: 301,
          type: "text",
          title: "請用一句話寫下今天最大的收穫",
          createdAt: "2026-04-08 09:00",
          status: "OPEN",
          targetIds: [1, 2, 3, 4, 6],
          answers: [
            { studentId: 1, content: "先看清楚規則，再作答比較穩。", submittedAt: "09:12", teacherComment: "這句整理得很好。" },
            { studentId: 8, content: "我記住了不要一股腦往錯方向改。", submittedAt: "09:15", teacherComment: "你有抓到今天的重點。" }
          ]
        },
        {
          id: 302,
          type: "choice",
          title: "明天暖身活動想先做哪一種？",
          createdAt: "2026-04-08 09:20",
          status: "OPEN",
          targetIds: [1, 2, 3, 4, 5, 6],
          options: [
            { key: "A", text: "老師先示範" },
            { key: "B", text: "小考檢討" },
            { key: "C", text: "分組討論" },
            { key: "D", text: "個人速答" },
            { key: "E", text: "直接進入新進度" }
          ],
          answers: [
            { studentId: 1, choiceKey: "A", submittedAt: "09:25", teacherComment: "你偏好先看一次流程。" },
            { studentId: 8, choiceKey: "E", submittedAt: "09:18", teacherComment: "你後來被移出對象，但仍可查看這筆紀錄。" }
          ]
        }
      ]
    };
  }

  var state = makeState();
  var ui = {
    shell: document.querySelector(".student-shell"),
    questionList: document.getElementById("questionList"),
    emptyView: document.getElementById("emptyView"),
    pagerRow: document.getElementById("pagerRow"),
    refreshBtn: document.getElementById("refreshBtn"),
    manageBtn: document.getElementById("openManageBtn"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    modalBody: document.getElementById("modalBody"),
    closeModalBtn: document.getElementById("closeModalBtn")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getActiveStudent() {
    return state.students.find(function (student) {
      return student.id === state.activeStudentId;
    });
  }

  function getQuestion(questionId) {
    return state.questions.find(function (item) {
      return item.id === Number(questionId);
    });
  }

  function getOwnAnswer(question, studentId) {
    return question.answers.find(function (answer) {
      return answer.studentId === Number(studentId);
    });
  }

  function isTargeted(question, studentId) {
    return question.targetIds.indexOf(Number(studentId)) >= 0;
  }

  function ensureBanner() {
    var banner = document.getElementById("studentPreviewBanner");
    if (banner) return banner;
    banner = document.createElement("section");
    banner.id = "studentPreviewBanner";
    banner.className = "preview-banner";
    ui.shell.insertBefore(banner, ui.questionList);
    return banner;
  }

  function renderBanner() {
    var student = getActiveStudent();
    ensureBanner().innerHTML =
      "<h2>學生端正式頁預覽</h2>" +
      '<p class="preview-note">目前示範學生：<strong>' +
      escapeHtml(student ? student.name : "") +
      "</strong>。這裡直接沿用正式學生頁骨架，主要先看選擇題列表式作答與查看老師評論的效果。</p>";
  }

  function buildVisibleQuestions() {
    return state.questions.filter(function (question) {
      var ownAnswer = getOwnAnswer(question, state.activeStudentId);
      return isTargeted(question, state.activeStudentId) || !!ownAnswer;
    });
  }

  function renderQuestionCard(question) {
    var ownAnswer = getOwnAnswer(question, state.activeStudentId);
    var targeted = isTargeted(question, state.activeStudentId);
    var statusClass = ownAnswer ? "submitted" : "open";
    var statusText = ownAnswer ? "已作答" : "可作答";
    if (ownAnswer && !targeted) {
      statusClass = "closed";
      statusText = "僅保留查看";
    }
    var actionHtml = "";
    if (ownAnswer) {
      actionHtml = '<button type="button" class="action-btn view" data-action="open-own-answer" data-question-id="' + question.id + '">查看作答</button>';
    } else if (question.type === "choice") {
      actionHtml = '<button type="button" class="action-btn answer-do" data-action="open-choice-compose" data-question-id="' + question.id + '">開始作答</button>';
    } else {
      actionHtml = '<button type="button" class="action-btn answer disabled" disabled>問答題沿用現有流程</button>';
    }

    return (
      '<article class="question-card status-' +
      statusClass +
      '"><div class="question-top"><span class="status-tag ' +
      statusClass +
      '">' +
      statusText +
      '</span><span class="question-time">' +
      escapeHtml(question.createdAt) +
      '</span></div><h2 class="question-title">' +
      escapeHtml(question.title) +
      '</h2><p class="question-extra">題型：' +
      (question.type === "choice" ? "選擇題" : "問答題") +
      "</p>" +
      (!targeted && ownAnswer ? '<p class="preview-readonly-note">你已不在這題目前的指定對象中，但仍可查看自己先前送出的答案與老師評論。</p>' : "") +
      '<div class="question-actions">' +
      actionHtml +
      "</div></article>"
    );
  }

  function renderQuestionList() {
    var list = buildVisibleQuestions();
    ui.questionList.innerHTML = list.map(renderQuestionCard).join("");
    ui.emptyView.classList.toggle("hidden", list.length > 0);
    ui.pagerRow.classList.add("hidden");
  }

  function openModal(title, body, modalState) {
    state.modal = modalState || null;
    ui.modalTitle.textContent = title;
    ui.modalBody.innerHTML = body;
    ui.modalOverlay.classList.remove("hidden");
  }

  function closeModal() {
    state.modal = null;
    ui.modalOverlay.classList.add("hidden");
    ui.modalBody.innerHTML = "";
  }

  function renderStudentPicker() {
    openModal(
      "切換示範學生",
      '<div class="preview-question-switch">' +
        state.students
          .map(function (student) {
            return '<button type="button" class="preview-chip ' + (student.id === state.activeStudentId ? "active" : "") + '" data-action="pick-student" data-student-id="' + student.id + '">' + escapeHtml(student.name) + "</button>";
          })
          .join("") +
        "</div><p class=\"preview-note\">這只是示範頁功能，方便快速切不同學生，看畫面是不是清楚。</p>",
      { type: "pick-student" }
    );
  }

  function renderChoiceCompose(question) {
    var existingAnswer = getOwnAnswer(question, state.activeStudentId);
    var selectedKey = existingAnswer ? existingAnswer.choiceKey : (state.modal && state.modal.selectedKey) || "";
    openModal(
      "選擇題作答",
      '<div class="compose-step"><p class="compose-step-title">' +
        escapeHtml(question.title) +
        '</p><p class="preview-note">列表式呈現，選項數之後增加到 E、F、G 也不用重做整套版型。</p><div class="preview-option-list">' +
        question.options
          .map(function (option) {
            return '<label class="preview-option-row preview-choice-item ' + (selectedKey === option.key ? "active" : "") + '"><input class="preview-choice-radio" type="radio" name="choiceOption" data-role="choice-radio" value="' + escapeHtml(option.key) + '"' + (selectedKey === option.key ? " checked" : "") + ' /><span><strong>' + escapeHtml(option.key) + "</strong> " + escapeHtml(option.text) + "</span></label>";
          })
          .join("") +
        '</div><div class="modal-actions-stack"><button type="button" class="action-btn submit-now" data-action="submit-choice-answer" data-question-id="' +
        question.id +
        '">確認送出</button></div></div>',
      { type: "choice-compose", questionId: question.id, selectedKey: selectedKey }
    );
  }

  function renderOwnAnswer(question) {
    var answer = getOwnAnswer(question, state.activeStudentId);
    if (!answer) return;
    var body = "";
    if (question.type === "choice") {
      var option = question.options.find(function (item) {
        return item.key === answer.choiceKey;
      });
      body =
        '<div class="answer-box">你選的是 <strong>' +
        escapeHtml(answer.choiceKey) +
        "</strong>： " +
        escapeHtml(option ? option.text : "") +
        "</div>";
    } else {
      body = '<div class="answer-box">' + escapeHtml(answer.content) + "</div>";
    }

    openModal(
      "我的作答",
      '<div class="compose-step"><p class="compose-question-title">' +
        escapeHtml(question.title) +
        '</p><p class="question-extra">作答時間：' +
        escapeHtml(answer.submittedAt) +
        "</p>" +
        body +
        (answer.teacherComment
          ? '<div class="preview-comment-box">老師評論：' + escapeHtml(answer.teacherComment) + "</div>"
          : '<p class="preview-note">目前老師尚未留下評論。</p>') +
        (!isTargeted(question, state.activeStudentId) ? '<p class="preview-readonly-note">這題已不再出現在你的題目列表中，但因為你先前已作答，所以仍保留查看權。</p>' : "") +
        "</div>",
      { type: "own-answer", questionId: question.id }
    );
  }

  function renderAll() {
    renderBanner();
    renderQuestionList();
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.dataset.action;

    if (action === "pick-student") {
      state.activeStudentId = Number(target.dataset.studentId || 0);
      closeModal();
      renderAll();
      return;
    }
    if (action === "open-choice-compose") {
      renderChoiceCompose(getQuestion(target.dataset.questionId));
      return;
    }
    if (action === "open-own-answer") {
      renderOwnAnswer(getQuestion(target.dataset.questionId));
      return;
    }
    if (action === "submit-choice-answer") {
      var question = getQuestion(target.dataset.questionId);
      if (!question || !state.modal || !state.modal.selectedKey) return;
      var existing = getOwnAnswer(question, state.activeStudentId);
      if (existing) {
        existing.choiceKey = state.modal.selectedKey;
      } else {
        question.answers.push({
          studentId: state.activeStudentId,
          choiceKey: state.modal.selectedKey,
          submittedAt: "09:40",
          teacherComment: ""
        });
      }
      closeModal();
      renderAll();
      return;
    }
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (target.getAttribute("data-role") === "choice-radio" && state.modal) {
      state.modal.selectedKey = target.value;
      renderChoiceCompose(getQuestion(state.modal.questionId));
    }
  });

  ui.refreshBtn.addEventListener("click", function () {
    state = makeState();
    closeModal();
    renderAll();
  });
  ui.manageBtn.addEventListener("click", renderStudentPicker);
  ui.closeModalBtn.addEventListener("click", closeModal);
  ui.modalOverlay.addEventListener("click", function (event) {
    if (event.target === ui.modalOverlay) closeModal();
  });

  renderAll();
})();
