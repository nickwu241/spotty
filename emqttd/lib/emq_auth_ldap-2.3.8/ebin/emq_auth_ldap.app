{application, emq_auth_ldap, [
	{description, "Authentication/ACL with LDAP"},
	{vsn, "2.3.8"},
	{id, "v2.3.8-dirty"},
	{modules, ['emq_auth_ldap','emq_auth_ldap_app','emq_auth_ldap_cli','emq_auth_ldap_config','emq_auth_ldap_sup']},
	{registered, [emq_auth_ldap_sup]},
	{applications, [kernel,stdlib,eldap,ecpool,clique]},
	{mod, {emq_auth_ldap_app, []}}
]}.