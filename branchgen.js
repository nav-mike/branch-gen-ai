const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8_000 } = options;
  const controller = new AbortController();

  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
};

const typeKeywords = {
  fix: ["fix", "bug", "hotfix", "patch", "resolve", "issue"],
  feature: ["add", "feature", "implement", "new", "create"],
  refactor: ["refactor", "improve", "optimize", "cleanup"],
  test: ["test", "testing", "unit test", "integration test"],
  docs: ["docs", "document", "readme"],
  chore: ["update", "upgrade", "bump", "dependency"],
};

class NoAiBranch {
  constructor(title) {
    this.title = title;
    this.ok = true;
  }

  json() {
    return new Promise({
      candidates: [
        {
          content: {
            parts: [
              {
                text: this.#generateBranch(),
              },
            ],
          },
        },
      ],
    });
  }

  #generateBranch() {
    const titleLower = this.title.toLowerCase();
    let branchType = "feature";

    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some((kw) => titleLower.includes(kw))) {
        branchType = type;
        break;
      }
    }

    const description = titleLower
      .replace(/^(fix|feature|refactor|test|docs|chore)[:\s-]*/i, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .replace(0, 50);

    return `${branchType}/${description}`;
  }
}

const geminiUrl = (apikey, model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}`;

const processWithGemini = async (title) => {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Treat me as a programmer: offer precise, efficient solutions;
        include clean code snippets, best practices, and debugging tips;
        assume familiarity with common tools.
        Use a professional, formal tone in your responses.
        Keep your responses extremely brief and to the point.
        Prioritize brevity over detail.
        When the user's request is unclear or lacks necessary context,
        ask clarifying questions to better understand their needs.
        For example, if the user asks 'How do I save a PDF from an email?',
        you should ask what email service they use before providing specific instructions.
        There is a type of branches:
        feat - a new feature is introduced with the changes
        fix - a bug fix has occurred
        chore - changes that do not relate to a fix or feature and don't modify src or test files (for example updating dependencies)
        refactor - refactored code that neither fixes a bug nor adds a feature
        docs - updates to documentation such as a the README or other markdown files
        style - changes that do not affect the meaning of the code, likely related to code formatting such as white-space, missing semi-colons, and so on.
        test - including new or correcting previous tests
        perf - performance improvements
        ci - continuous integration related
        build - changes that affect the build system or external dependencies
        revert - reverts a previous commit.
        generate a git branch name for task "${title}" using git flow.
        pls write only branch name without any other text.`,
          },
        ],
      },
    ],
  };

  return browser.storage.sync
    .get(["apikey", "model"])
    .then((result) => {
      return result;
    })
    .then(({ apikey, model }) => {
      return fetchWithTimeout(geminiUrl(apikey, model), {
        method: "POST",
        headers: { ContentType: "application/json" },
        body: JSON.stringify(requestBody),
        timeout: 6_000,
      });
    })
    .then((response) => {
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      return response.json();
    })
    .then((result) => {
      return result.candidates[0].content.parts[0].text;
    });
};

browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== "processWithGemini") return true;

  processWithGemini(message.data)
    .then((result) => {
      sendResponse({ result });
    })
    .catch((err) => {
      sendResponse({ result: err });
    });

  return true;
});
