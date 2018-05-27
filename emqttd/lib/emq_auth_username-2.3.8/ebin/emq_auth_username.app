{application, emq_auth_username, [
	{description, "Authentication with Username/Password"},
	{vsn, "2.3.8"},
	{id, "v2.3.8-dirty"},
	{modules, ['emq_auth_username','emq_auth_username_app']},
	{registered, [emq_auth_username_sup]},
	{applications, [kernel,stdlib]},
	{mod, {emq_auth_username_app, []}}
]}.