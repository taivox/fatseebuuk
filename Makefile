lint:
	cd back-end ; golangci-lint run --max-same-issues=0 --max-issues-per-linter=0

lint-fmt:
	gofumpt -l -w .
